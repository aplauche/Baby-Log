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

function EntryRow({ entry }: { entry: Entry }) {
  const chips: string[] = [];
  if (entry.foodType === "bottle" || entry.foodType === "both") {
    chips.push(`🍼 Bottle${entry.bottleAmountMl ? ` · ${entry.bottleAmountMl}ml` : ""}`);
  }
  if (entry.foodType === "breast" || entry.foodType === "both") {
    const parts: string[] = [];
    if (entry.breastLeftDurationMin) parts.push(`L ${entry.breastLeftDurationMin}min`);
    if (entry.breastRightDurationMin) parts.push(`R ${entry.breastRightDurationMin}min`);
    chips.push(`🤱 Breast${parts.length ? ` · ${parts.join(", ")}` : ""}`);
  }
  if (entry.pee) chips.push("💧 Pee");
  if (entry.poop) chips.push("💩 Poop");

  return (
    <div className="flex gap-3 items-start py-3">
      <span className="text-sm font-semibold text-base-content/40 w-16 shrink-0 pt-0.5">
        {formatTime(entry.entryTime)}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-1.5">
          {chips.length > 0 ? (
            chips.map((chip) => (
              <span key={chip} className="badge badge-outline badge-md py-3 px-3">{chip}</span>
            ))
          ) : (
            <span className="text-sm text-base-content/30 italic">No details</span>
          )}
        </div>
        {entry.comments && (
          <p className="text-sm text-base-content/50 mt-1">{entry.comments}</p>
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
  // Feeding — two independent toggles
  const [showBreast, setShowBreast] = useState(false);
  const [breastLeft, setBreastLeft] = useState(false);
  const [breastLeftDuration, setBreastLeftDuration] = useState("");
  const [breastRight, setBreastRight] = useState(false);
  const [breastRightDuration, setBreastRightDuration] = useState("");
  const [showBottle, setShowBottle] = useState(false);
  const [bottleAmountMl, setBottleAmountMl] = useState("");
  // Diaper + notes
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-base-content">Log</h1>
        <button
          className={`btn btn-sm shadow-sm gap-1 ${formOpen ? "btn-outline btn-primary" : "btn-primary"}`}
          onClick={() => { if (formOpen) { setFormOpen(false); resetForm(); } else { openForm(); } }}
        >
          {formOpen ? "✕ Cancel" : "+ New Entry"}
        </button>
      </div>

      {/* Collapsible form */}
      {formOpen && (
        <div className="mb-8">
          {error && (
            <div className="alert alert-error shadow-sm mb-4"><span>{error}</span></div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* When */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body py-4">
                <p className="text-xs uppercase tracking-widest text-primary/70 font-bold mb-2">When</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label py-1"><span className="label-text">Date</span></label>
                    <input type="date" className="input input-bordered w-full" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} required />
                  </div>
                  <div className="form-control">
                    <label className="label py-1"><span className="label-text">Time</span></label>
                    <input type="time" className="input input-bordered w-full" value={entryTime} onChange={(e) => setEntryTime(e.target.value)} required />
                  </div>
                </div>
              </div>
            </div>

            {/* Breast — independent collapsible */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <button
                type="button"
                className="w-full flex items-center justify-between px-5 py-4"
                onClick={() => setShowBreast(!showBreast)}
              >
                <span className="flex items-center gap-2 font-semibold">
                  🤱 <span>Breast feeding</span>
                </span>
                <span className={`transition-transform duration-200 text-base-content/40 ${showBreast ? "rotate-180" : ""}`}>▾</span>
              </button>
              {showBreast && (
                <div className="px-5 pb-4 border-t border-base-200 pt-3 space-y-3">
                  {/* Left */}
                  <div>
                    <label className="label cursor-pointer justify-start gap-3 py-1">
                      <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" checked={breastLeft} onChange={(e) => setBreastLeft(e.target.checked)} />
                      <span className="label-text font-semibold">Left</span>
                    </label>
                    {breastLeft && (
                      <input type="number" className="input input-bordered w-full mt-1" placeholder="Duration (min)" min="0" value={breastLeftDuration} onChange={(e) => setBreastLeftDuration(e.target.value)} />
                    )}
                  </div>
                  {/* Right */}
                  <div>
                    <label className="label cursor-pointer justify-start gap-3 py-1">
                      <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" checked={breastRight} onChange={(e) => setBreastRight(e.target.checked)} />
                      <span className="label-text font-semibold">Right</span>
                    </label>
                    {breastRight && (
                      <input type="number" className="input input-bordered w-full mt-1" placeholder="Duration (min)" min="0" value={breastRightDuration} onChange={(e) => setBreastRightDuration(e.target.value)} />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottle — independent collapsible */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <button
                type="button"
                className="w-full flex items-center justify-between px-5 py-4"
                onClick={() => setShowBottle(!showBottle)}
              >
                <span className="flex items-center gap-2 font-semibold">
                  🍼 <span>Bottle feeding</span>
                </span>
                <span className={`transition-transform duration-200 text-base-content/40 ${showBottle ? "rotate-180" : ""}`}>▾</span>
              </button>
              {showBottle && (
                <div className="px-5 pb-4 border-t border-base-200 pt-3">
                  <div className="form-control">
                    <label className="label py-1"><span className="label-text">Amount (ml)</span></label>
                    <input type="number" className="input input-bordered w-full" placeholder="e.g. 120" min="0" step="5" value={bottleAmountMl} onChange={(e) => setBottleAmountMl(e.target.value)} />
                  </div>
                </div>
              )}
            </div>

            {/* Diaper */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body py-4">
                <p className="text-xs uppercase tracking-widest text-primary/70 font-bold mb-2">Diaper</p>
                <div className="flex gap-6">
                  <label className="label cursor-pointer gap-3">
                    <input type="checkbox" className="checkbox checkbox-primary" checked={pee} onChange={(e) => setPee(e.target.checked)} />
                    <span className="label-text text-lg">💧 Pee</span>
                  </label>
                  <label className="label cursor-pointer gap-3">
                    <input type="checkbox" className="checkbox checkbox-primary" checked={poop} onChange={(e) => setPoop(e.target.checked)} />
                    <span className="label-text text-lg">💩 Poop</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body py-4">
                <p className="text-xs uppercase tracking-widest text-primary/70 font-bold mb-2">Additional Notes</p>
                <textarea className="textarea textarea-bordered w-full" placeholder="Any additional notes..." rows={2} value={comments} onChange={(e) => setComments(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block shadow-md" disabled={submitting}>
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
        <div className="text-center py-16 text-base-content/40">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-semibold">No entries yet</p>
          <p className="text-sm mt-1">Tap "+ New Entry" to get started</p>
        </div>
      ) : (
        <div className="space-y-6">
          {dates.map((date) => (
            <div key={date}>
              <p className="text-xs uppercase tracking-widest text-base-content/40 font-bold pb-1 border-b border-base-300 mb-1">
                {formatDate(date)}
              </p>
              <div className="divide-y divide-base-200">
                {byDate[date].map((entry) => (
                  <EntryRow key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
