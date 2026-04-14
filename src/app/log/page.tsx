"use client";

import { useState } from "react";
import Link from "next/link";

type FoodType = "breast" | "bottle" | "";

export default function LogPage() {
  const now = new Date();
  const [entryDate, setEntryDate] = useState(now.toISOString().split("T")[0]);
  const [entryTime, setEntryTime] = useState(
    now.toTimeString().slice(0, 5)
  );
  const [foodType, setFoodType] = useState<FoodType>("");
  const [bottleAmountMl, setBottleAmountMl] = useState("");
  const [breastSide, setBreastSide] = useState("");
  const [breastDurationMin, setBreastDurationMin] = useState("");
  const [pee, setPee] = useState(false);
  const [poop, setPoop] = useState(false);
  const [comments, setComments] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryDate,
          entryTime,
          foodType: foodType || null,
          bottleAmountMl: foodType === "bottle" ? Number(bottleAmountMl) || null : null,
          breastSide: foodType === "breast" ? breastSide || null : null,
          breastDurationMin:
            foodType === "breast" ? Number(breastDurationMin) || null : null,
          pee,
          poop,
          comments: comments || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save entry");

      setSuccess(true);
      // Reset form
      const newNow = new Date();
      setEntryDate(newNow.toISOString().split("T")[0]);
      setEntryTime(newNow.toTimeString().slice(0, 5));
      setFoodType("");
      setBottleAmountMl("");
      setBreastSide("");
      setBreastDurationMin("");
      setPee(false);
      setPoop(false);
      setComments("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">New Log Entry</h1>

      {success && (
        <div className="alert alert-success mb-6">
          <span>Entry saved! </span>
          <Link href="/analytics" className="link link-hover font-medium">
            View Analytics →
          </Link>
        </div>
      )}

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date & Time */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-sm uppercase tracking-wide text-base-content/50">
              When
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Time</span>
                </label>
                <input
                  type="time"
                  className="input input-bordered w-full"
                  value={entryTime}
                  onChange={(e) => setEntryTime(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feeding */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-sm uppercase tracking-wide text-base-content/50">
              Feeding (optional)
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                className={`btn flex-1 ${foodType === "breast" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setFoodType(foodType === "breast" ? "" : "breast")}
              >
                🤱 Breast
              </button>
              <button
                type="button"
                className={`btn flex-1 ${foodType === "bottle" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setFoodType(foodType === "bottle" ? "" : "bottle")}
              >
                🍼 Bottle
              </button>
            </div>

            {/* Bottle fields */}
            {foodType === "bottle" && (
              <div className="form-control mt-2">
                <label className="label">
                  <span className="label-text">Amount (ml)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="e.g. 120"
                  min="0"
                  step="5"
                  value={bottleAmountMl}
                  onChange={(e) => setBottleAmountMl(e.target.value)}
                />
              </div>
            )}

            {/* Breast fields */}
            {foodType === "breast" && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Side</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={breastSide}
                    onChange={(e) => setBreastSide(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Duration (min)</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    placeholder="e.g. 15"
                    min="0"
                    value={breastDurationMin}
                    onChange={(e) => setBreastDurationMin(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Diaper */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-sm uppercase tracking-wide text-base-content/50">
              Diaper (optional)
            </h2>
            <div className="flex gap-6">
              <label className="label cursor-pointer gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={pee}
                  onChange={(e) => setPee(e.target.checked)}
                />
                <span className="label-text text-lg">💧 Pee</span>
              </label>
              <label className="label cursor-pointer gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={poop}
                  onChange={(e) => setPoop(e.target.checked)}
                />
                <span className="label-text text-lg">💩 Poop</span>
              </label>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-sm uppercase tracking-wide text-base-content/50">
              Notes (optional)
            </h2>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Any additional notes..."
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary btn-block btn-lg"
          disabled={submitting}
        >
          {submitting ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "Save Entry"
          )}
        </button>
      </form>
    </div>
  );
}
