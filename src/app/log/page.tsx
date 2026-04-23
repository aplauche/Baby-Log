"use client";

import { useState, useEffect, useCallback } from "react";
import type { Entry } from "@/db/schema";

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

function formatDate(date: string) {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (date === today) return "Today";
  if (date === yesterday) return "Yesterday";
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function EntryRow({ entry, index }: { entry: Entry; index: number }) {
  const chips: { label: string; emoji: string; bg: string }[] = [];
  if (entry.foodType === "bottle" || entry.foodType === "both") {
    chips.push({
      label: `Bottle${entry.bottleAmountMl ? ` · ${entry.bottleAmountMl}ml` : ""}`,
      emoji: "🍼",
      bg: "#EFF6FF",
    });
  }
  if (entry.foodType === "breast" || entry.foodType === "both") {
    const parts: string[] = [];
    if (entry.breastLeftDurationMin) parts.push(`L ${entry.breastLeftDurationMin}min`);
    if (entry.breastRightDurationMin) parts.push(`R ${entry.breastRightDurationMin}min`);
    chips.push({
      label: `Breast${parts.length ? ` · ${parts.join(", ")}` : ""}`,
      emoji: "🤱",
      bg: "#FFF0F5",
    });
  }
  if (entry.pee) chips.push({ label: "Pee", emoji: "💧", bg: "#EFF6FF" });
  if (entry.poop) chips.push({ label: "Poop", emoji: "💩", bg: "#FFFBEB" });

  const isEven = index % 2 === 0;

  return (
    <div
      className="journal-row flex gap-3 items-start px-2"
      style={isEven ? { backgroundColor: "rgba(237, 231, 217, 0.35)" } : {}}
    >
      <span
        className="text-sm font-semibold w-16 shrink-0 pt-0.5"
        style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1rem", color: "#9e9080" }}
      >
        {formatTime(entry.entryTime)}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-1.5">
          {chips.length > 0 ? (
            chips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-medium border"
                style={{
                  backgroundColor: chip.bg,
                  borderColor: "#D9D0C0",
                  color: "#3d2a2a",
                  fontFamily: "var(--font-nunito), sans-serif",
                }}
              >
                <span className="sticker" style={{ width: "1.25rem", height: "1.25rem", fontSize: "0.75rem" }}>
                  {chip.emoji}
                </span>
                {chip.label}
              </span>
            ))
          ) : (
            <span className="text-sm italic" style={{ color: "#9e9080", fontFamily: "var(--font-nunito), sans-serif" }}>No details</span>
          )}
        </div>
        {entry.comments && (
          <p className="text-sm mt-1" style={{ color: "#9e9080", fontFamily: "var(--font-nunito), sans-serif" }}>
            {entry.comments}
          </p>
        )}
      </div>
    </div>
  );
}

export default function LogPage() {
  const now = new Date();

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [entryDate, setEntryDate] = useState(now.toISOString().split("T")[0]);
  const [entryTime, setEntryTime] = useState(now.toTimeString().slice(0, 5));
  const [showBreast, setShowBreast] = useState(false);
  const [breastLeft, setBreastLeft] = useState(false);
  const [breastLeftDuration, setBreastLeftDuration] = useState("");
  const [breastRight, setBreastRight] = useState(false);
  const [breastRightDuration, setBreastRightDuration] = useState("");
  const [showBottle, setShowBottle] = useState(false);
  const [bottleAmountMl, setBottleAmountMl] = useState("");
  const [pee, setPee] = useState(false);
  const [poop, setPoop] = useState(false);
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Entries list state
  const [allEntries, setAllEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/entries");
      setAllEntries(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const openForm = () => {
    const n = new Date();
    setEntryDate(n.toISOString().split("T")[0]);
    setEntryTime(n.toTimeString().slice(0, 5));
    setFormOpen(true);
  };

  const resetForm = () => {
    setShowBreast(false);
    setBreastLeft(false);
    setBreastLeftDuration("");
    setBreastRight(false);
    setBreastRightDuration("");
    setShowBottle(false);
    setBottleAmountMl("");
    setPee(false);
    setPoop(false);
    setComments("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const foodType =
      showBreast && showBottle ? "both"
      : showBreast ? "breast"
      : showBottle ? "bottle"
      : null;

    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryDate,
          entryTime,
          foodType,
          bottleAmountMl: showBottle ? Number(bottleAmountMl) || null : null,
          breastLeftDurationMin: showBreast && breastLeft ? Number(breastLeftDuration) || null : null,
          breastRightDurationMin: showBreast && breastRight ? Number(breastRightDuration) || null : null,
          pee,
          poop,
          comments: comments || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save entry");
      resetForm();
      setFormOpen(false);
      await fetchEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // Group by date, already sorted desc from API
  const byDate = allEntries.reduce<Record<string, Entry[]>>((acc, entry) => {
    (acc[entry.entryDate] ??= []).push(entry);
    return acc;
  }, {});
  const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="max-w-xl mx-auto px-4 py-8">

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-5xl font-bold text-ink"
          style={{ fontFamily: "var(--font-caveat), cursive" }}
        >
          <span className="sticker mr-2" style={{ width: "2rem", height: "2rem", fontSize: "1.1rem" }}>📋</span>
          Log
        </h1>
        <button
          className={`btn btn-sm btn-stamp gap-1 ${formOpen ? "btn-outline" : "btn-primary"}`}
          style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1rem", letterSpacing: "0.02em" }}
          onClick={() => { if (formOpen) { setFormOpen(false); resetForm(); } else { openForm(); } }}
        >
          {formOpen ? "✕ Cancel" : "+ New Entry"}
        </button>
      </div>

      {/* Collapsible entry form */}
      {formOpen && (
        <div className="mb-8">
          {error && (
            <div className="alert alert-error shadow-sm mb-4 rounded-xl border border-error/40">
              <span style={{ fontFamily: "var(--font-nunito), sans-serif" }}>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* When */}
            <div className="card-scrapbook p-4">
              <p className="section-label mb-3">When</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full bg-white"
                    style={{ fontFamily: "var(--font-nunito), sans-serif", borderColor: "#D9D0C0" }}
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>Time</span>
                  </label>
                  <input
                    type="time"
                    className="input input-bordered w-full bg-white"
                    style={{ fontFamily: "var(--font-nunito), sans-serif", borderColor: "#D9D0C0" }}
                    value={entryTime}
                    onChange={(e) => setEntryTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Breast feeding — collapsible */}
            <div className="card-scrapbook overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between px-5 py-4"
                onClick={() => setShowBreast(!showBreast)}
              >
                <span className="flex items-center gap-2 font-semibold text-ink"
                      style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.15rem" }}>
                  <span className="sticker" style={{ width: "1.6rem", height: "1.6rem", fontSize: "0.9rem", backgroundColor: "#FFF0F5" }}>🤱</span>
                  Breast feeding
                </span>
                <span className={`transition-transform duration-200 text-ink-faint ${showBreast ? "rotate-180" : ""}`}>▾</span>
              </button>
              {showBreast && (
                <div className="px-5 pb-4 dashed-divider pt-3 space-y-3">
                  <div>
                    <label className="label cursor-pointer justify-start gap-3 py-1">
                      <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" checked={breastLeft} onChange={(e) => setBreastLeft(e.target.checked)} />
                      <span className="label-text font-semibold" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>Left</span>
                    </label>
                    {breastLeft && (
                      <input
                        type="number"
                        className="input input-bordered w-full mt-1 bg-white"
                        style={{ fontFamily: "var(--font-nunito), sans-serif", borderColor: "#D9D0C0" }}
                        placeholder="Duration (min)"
                        min="0"
                        value={breastLeftDuration}
                        onChange={(e) => setBreastLeftDuration(e.target.value)}
                      />
                    )}
                  </div>
                  <div>
                    <label className="label cursor-pointer justify-start gap-3 py-1">
                      <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" checked={breastRight} onChange={(e) => setBreastRight(e.target.checked)} />
                      <span className="label-text font-semibold" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>Right</span>
                    </label>
                    {breastRight && (
                      <input
                        type="number"
                        className="input input-bordered w-full mt-1 bg-white"
                        style={{ fontFamily: "var(--font-nunito), sans-serif", borderColor: "#D9D0C0" }}
                        placeholder="Duration (min)"
                        min="0"
                        value={breastRightDuration}
                        onChange={(e) => setBreastRightDuration(e.target.value)}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottle feeding — collapsible */}
            <div className="card-scrapbook overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between px-5 py-4"
                onClick={() => setShowBottle(!showBottle)}
              >
                <span className="flex items-center gap-2 font-semibold text-ink"
                      style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.15rem" }}>
                  <span className="sticker" style={{ width: "1.6rem", height: "1.6rem", fontSize: "0.9rem", backgroundColor: "#EFF6FF" }}>🍼</span>
                  Bottle feeding
                </span>
                <span className={`transition-transform duration-200 text-ink-faint ${showBottle ? "rotate-180" : ""}`}>▾</span>
              </button>
              {showBottle && (
                <div className="px-5 pb-4 dashed-divider pt-3">
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>Amount (ml)</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full bg-white"
                      style={{ fontFamily: "var(--font-nunito), sans-serif", borderColor: "#D9D0C0" }}
                      placeholder="e.g. 120"
                      min="0"
                      step="5"
                      value={bottleAmountMl}
                      onChange={(e) => setBottleAmountMl(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Diaper */}
            <div className="card-scrapbook p-4">
              <p className="section-label mb-3">Diaper</p>
              <div className="flex gap-6">
                <label className="label cursor-pointer gap-3">
                  <input type="checkbox" className="checkbox checkbox-primary" checked={pee} onChange={(e) => setPee(e.target.checked)} />
                  <span className="label-text text-lg flex items-center gap-1.5" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
                    <span className="sticker" style={{ width: "1.5rem", height: "1.5rem", fontSize: "0.85rem" }}>💧</span>
                    Pee
                  </span>
                </label>
                <label className="label cursor-pointer gap-3">
                  <input type="checkbox" className="checkbox checkbox-primary" checked={poop} onChange={(e) => setPoop(e.target.checked)} />
                  <span className="label-text text-lg flex items-center gap-1.5" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
                    <span className="sticker" style={{ width: "1.5rem", height: "1.5rem", fontSize: "0.85rem" }}>💩</span>
                    Poop
                  </span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="card-scrapbook p-4">
              <p className="section-label mb-3">Additional Notes</p>
              <textarea
                className="textarea textarea-bordered w-full bg-white"
                style={{ fontFamily: "var(--font-nunito), sans-serif", borderColor: "#D9D0C0" }}
                placeholder="Any additional notes..."
                rows={2}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-stamp"
              style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.2rem", letterSpacing: "0.03em" }}
              disabled={submitting}
            >
              {submitting ? <span className="loading loading-spinner loading-sm" /> : "Save Entry"}
            </button>
          </form>
        </div>
      )}

      {/* Entries list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : allEntries.length === 0 ? (
        <div className="text-center py-16">
          <span className="sticker mx-auto mb-3" style={{ width: "4rem", height: "4rem", fontSize: "2rem" }}>📋</span>
          <p className="font-bold text-ink mt-4" style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.3rem" }}>No entries yet</p>
          <p className="text-sm mt-1 text-ink-faint" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>Tap &ldquo;+ New Entry&rdquo; to get started</p>
        </div>
      ) : (
        <div className="space-y-6">
          {dates.map((date) => (
            <div key={date}>
              {/* Date heading — like a tab divider in a planner */}
              <div className="flex items-center gap-3 mb-1">
                <p
                  className="section-label"
                  style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1rem" }}
                >
                  {formatDate(date)}
                </p>
                <div className="flex-1 dashed-divider" />
              </div>
              {/* Ruled rows */}
              <div className="card-scrapbook overflow-hidden">
                {byDate[date].map((entry, i) => (
                  <EntryRow key={entry.id} entry={entry} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
