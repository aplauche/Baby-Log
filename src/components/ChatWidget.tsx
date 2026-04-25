"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  "When is poop-free time?",
  "How are feedings trending?",
  "Summarize the last 3 days",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLookingUp, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setIsLookingUp(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Sorry, something went wrong: ${err.error || res.statusText}` },
        ]);
        setIsLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setIsLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let assistantText = "";
      let buffer = "";

      // Add empty assistant message that we'll stream into
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6);
          try {
            const data = JSON.parse(jsonStr);
            if (data.type === "text") {
              assistantText += data.content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantText,
                };
                return updated;
              });
            } else if (data.type === "tool_use") {
              setIsLookingUp(true);
            } else if (data.type === "done") {
              setIsLookingUp(false);
            } else if (data.type === "error") {
              assistantText += `\n\nSorry, an error occurred: ${data.message}`;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantText,
                };
                return updated;
              });
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.content !== ""),
        { role: "assistant", content: "Sorry, I couldn't connect. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
      setIsLookingUp(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      {/* Floating action button */}
      <button
        className="chat-fab"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Close AI Insights" : "Open AI Insights"}
      >
        {isOpen ? "\u2715" : "\u2728"}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="chat-panel">
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{
              borderBottom: "2px solid #1a1a2e",
              borderRadius: "14px 14px 0 0",
              background: "#F8F5FF",
            }}
          >
            <span
              className="font-bold text-sm"
              style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.2rem", color: "#1a1a2e" }}
            >
              AI Insights
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm opacity-50 hover:opacity-100"
              style={{ color: "#1a1a2e" }}
            >
              \u2715
            </button>
          </div>

          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center gap-3 pt-6">
                <p className="text-sm text-center" style={{ color: "#7c6bb0" }}>
                  Ask me anything about your baby&apos;s patterns!
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      className="chat-suggestion"
                      onClick={() => sendMessage(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    msg.role === "user"
                      ? "chat-bubble-user"
                      : "chat-bubble-assistant"
                  }
                  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {msg.content || (isLoading && i === messages.length - 1 ? "\u2026" : "")}
                </div>
              </div>
            ))}

            {isLookingUp && (
              <div className="flex justify-start">
                <div
                  className="chat-bubble-assistant text-xs italic"
                  style={{ background: "#F8F5FF" }}
                >
                  Looking up baby data...
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 p-3"
            style={{ borderTop: "1.5px dashed #C9B8FF" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about patterns..."
              disabled={isLoading}
              className="flex-1 text-sm px-3 py-2 rounded-lg outline-none"
              style={{
                border: "1.5px solid #C9B8FF",
                background: "#F8F5FF",
                color: "#1a1a2e",
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="text-sm font-bold px-3 py-2 rounded-lg"
              style={{
                background: isLoading || !input.trim() ? "#C9B8FF" : "#FF6EB4",
                color: "white",
                border: "1.5px solid #1a1a2e",
                cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
