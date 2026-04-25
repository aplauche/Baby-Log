import Anthropic from "@anthropic-ai/sdk";
import { getEntriesToolDef, executeGetEntries } from "@/lib/chat-tools";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are BabyLog AI, a helpful and warm assistant for parents tracking their baby's feeding and diaper patterns. You have access to the baby's log data and can help parents understand patterns, predict timing, and answer questions.

When answering questions:
- Be warm, supportive, and concise
- Always use the get_baby_log_entries tool to fetch relevant data before answering data questions
- Look for patterns in timing, frequency, and amounts
- Give practical, actionable advice
- Format times in a parent-friendly way (e.g., "around 2pm" not "14:00")
- If data is insufficient, say so honestly
- Keep responses short — parents are busy!

Today's date is ${new Date().toISOString().split("T")[0]}.`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages } = (await request.json()) as { messages: ChatMessage[] };

  if (!messages || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "No messages provided" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const client = new Anthropic({ apiKey });
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(data: Record<string, unknown>) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }

      try {
        // Build conversation messages for the API
        const apiMessages: Anthropic.MessageParam[] = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        let iterations = 0;
        const maxIterations = 3;

        while (iterations < maxIterations) {
          iterations++;

          const response = await client.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: apiMessages,
            tools: [getEntriesToolDef],
            stream: true,
          });

          // Accumulate the full response to check for tool use
          let currentText = "";
          const toolUseBlocks: Array<{
            id: string;
            name: string;
            input: Record<string, unknown>;
          }> = [];
          let currentToolId = "";
          let currentToolName = "";
          let currentToolInput = "";
          let stopReason: string | null = null;

          for await (const event of response) {
            if (event.type === "content_block_start") {
              if (event.content_block.type === "tool_use") {
                currentToolId = event.content_block.id;
                currentToolName = event.content_block.name;
                currentToolInput = "";
                send({ type: "tool_use", name: event.content_block.name });
              }
            } else if (event.type === "content_block_delta") {
              if (event.delta.type === "text_delta") {
                currentText += event.delta.text;
                send({ type: "text", content: event.delta.text });
              } else if (event.delta.type === "input_json_delta") {
                currentToolInput += event.delta.partial_json;
              }
            } else if (event.type === "content_block_stop") {
              if (currentToolId) {
                toolUseBlocks.push({
                  id: currentToolId,
                  name: currentToolName,
                  input: JSON.parse(currentToolInput || "{}"),
                });
                currentToolId = "";
                currentToolName = "";
                currentToolInput = "";
              }
            } else if (event.type === "message_delta") {
              stopReason = event.delta.stop_reason;
            }
          }

          // If Claude wants to use tools, execute them and continue the loop
          if (stopReason === "tool_use" && toolUseBlocks.length > 0) {
            // Build assistant message content blocks
            const assistantContent: Anthropic.ContentBlockParam[] = [];
            if (currentText) {
              assistantContent.push({ type: "text", text: currentText });
            }
            for (const tool of toolUseBlocks) {
              assistantContent.push({
                type: "tool_use",
                id: tool.id,
                name: tool.name,
                input: tool.input,
              });
            }
            apiMessages.push({ role: "assistant", content: assistantContent });

            // Execute each tool and build tool results
            const toolResults: Anthropic.ToolResultBlockParam[] = [];
            for (const tool of toolUseBlocks) {
              let result: string;
              try {
                if (tool.name === "get_baby_log_entries") {
                  const days = (tool.input as { days?: number }).days ?? 7;
                  result = await executeGetEntries(days);
                } else {
                  result = JSON.stringify({ error: `Unknown tool: ${tool.name}` });
                }
              } catch (err) {
                result = JSON.stringify({
                  error: `Tool execution failed: ${err instanceof Error ? err.message : "unknown error"}`,
                });
              }
              toolResults.push({
                type: "tool_result",
                tool_use_id: tool.id,
                content: result,
              });
            }
            apiMessages.push({ role: "user", content: toolResults });

            // Continue the loop — Claude will process tool results
            continue;
          }

          // Not a tool use — we're done
          break;
        }

        send({ type: "done" });
      } catch (err) {
        send({
          type: "error",
          message: err instanceof Error ? err.message : "An unexpected error occurred",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
