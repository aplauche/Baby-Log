"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DailyData {
  date: string;
  feedings: number;
  bottle: number;
  breast: number;
  pee: number;
  poop: number;
  bottleMl: number;
}

interface AnalyticsData {
  days: number;
  interval: "hour" | "6hour" | "day";
  totalFeedings: number;
  feedingsPerDay: number;
  avgBottleMl: number;
  avgBreastMin: number;
  totalPee: number;
  totalPoop: number;
  peePerDay: number;
  poopPerDay: number;
  bottleCount: number;
  breastCount: number;
  daily: DailyData[];
}

const fmt = (n: number) => parseFloat(n.toFixed(1));

const PERIODS = [
  { label: "24 Hours", days: 1 },
  { label: "3 Days", days: 3 },
  { label: "7 Days", days: 7 },
];

// Stat card metadata — each card gets a soft tinted background and a sticker emoji
const STAT_META = [
  { emoji: "🍽️", bg: "#FFF0F5", borderColor: "#F2B8C6", label: "Feedings / Day" },
  { emoji: "🍼", bg: "#EFF6FF", borderColor: "#93C5FD", label: "Avg Bottle" },
  { emoji: "🤱", bg: "#F5F0FF", borderColor: "#B8AEDD", label: "Avg Breast" },
  { emoji: "👶", bg: "#F0FFF5", borderColor: "#A8C5A0", label: "Diapers / Day" },
];

export default function AnalyticsPage() {
  const [activeDays, setActiveDays] = useState(7);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (days: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?days=${days}`);
      const json = await res.json();
      setData(json);
    } catch {
      console.error("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(activeDays);
  }, [activeDays, fetchData]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatHour = (dateHour: string) => {
    const h = parseInt(dateHour.split("T")[1], 10);
    if (h === 0) return "12am";
    if (h < 12) return `${h}am`;
    if (h === 12) return "12pm";
    return `${h - 12}pm`;
  };

  const formatSixHour = (dateHour: string) => {
    const [datePart, hourPart] = dateHour.split("T");
    const d = new Date(datePart + "T00:00:00");
    const day = d.toLocaleDateString("en-US", { weekday: "short" });
    const h = parseInt(hourPart, 10);
    const label = h === 0 ? "12am" : h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`;
    return `${day} ${label}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="alert alert-warning rounded-xl border border-warning/40">
          Could not load analytics data.
        </div>
      </div>
    );
  }

  const labels = data.daily.map((d) =>
    data.interval === "hour" ? formatHour(d.date)
    : data.interval === "6hour" ? formatSixHour(d.date)
    : formatDate(d.date)
  );

  // Chart colors pulled from the scrapbook palette
  const feedingChartData = {
    labels,
    datasets: [
      {
        label: "Bottle",
        data: data.daily.map((d) => d.bottle),
        backgroundColor: "rgba(139, 184, 212, 0.65)",
        borderColor: "rgba(139, 184, 212, 1)",
        borderWidth: 1.5,
        borderRadius: 5,
      },
      {
        label: "Breast",
        data: data.daily.map((d) => d.breast),
        backgroundColor: "rgba(242, 184, 198, 0.65)",
        borderColor: "rgba(242, 184, 198, 1)",
        borderWidth: 1.5,
        borderRadius: 5,
      },
    ],
  };

  const diaperChartData = {
    labels,
    datasets: [
      {
        label: "Pee",
        data: data.daily.map((d) => d.pee),
        borderColor: "rgb(139, 184, 212)",
        backgroundColor: "rgba(139, 184, 212, 0.12)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: "white",
        pointBorderColor: "rgb(139, 184, 212)",
        pointBorderWidth: 2,
      },
      {
        label: "Poop",
        data: data.daily.map((d) => d.poop),
        borderColor: "rgb(200, 162, 100)",
        backgroundColor: "rgba(200, 162, 100, 0.12)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: "white",
        pointBorderColor: "rgb(200, 162, 100)",
        pointBorderWidth: 2,
      },
    ],
  };

  const volumeChartData = {
    labels,
    datasets: [
      {
        label: "Bottle ml",
        data: data.daily.map((d) => d.bottleMl),
        borderColor: "rgb(139, 184, 212)",
        backgroundColor: "rgba(139, 184, 212, 0.15)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: "white",
        pointBorderColor: "rgb(139, 184, 212)",
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: { family: "'Nunito', sans-serif", size: 12 },
          color: "#3d2a2a",
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: "rgba(255,255,255,0.95)",
        borderColor: "#D9D0C0",
        borderWidth: 1,
        titleColor: "#3d2a2a",
        bodyColor: "#6b5050",
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(217,208,192,0.5)", lineWidth: 1 },
        ticks: { color: "#9e9080", font: { family: "'Nunito', sans-serif", size: 11 } },
        border: { color: "#D9D0C0" },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: "#9e9080", font: { family: "'Nunito', sans-serif", size: 11 } },
        grid: { color: "rgba(217,208,192,0.5)", lineWidth: 1 },
        border: { color: "#D9D0C0", dash: [4, 4] },
      },
    },
  };

  const statValues = [
    { value: `${fmt(data.feedingsPerDay)}`, sub: `${data.totalFeedings} total` },
    { value: `${fmt(data.avgBottleMl)} ml`, sub: `${data.bottleCount} feedings` },
    { value: `${fmt(data.avgBreastMin)} min`, sub: `${data.breastCount} feedings` },
    {
      value: `${fmt(data.peePerDay + data.poopPerDay)}`,
      sub: (
        <span className="flex items-center gap-1">
          <span className="sticker" style={{ width: "1rem", height: "1rem", fontSize: "0.6rem" }}>💧</span>
          {fmt(data.peePerDay)}
          <span className="mx-0.5 text-paper-darker">&middot;</span>
          <span className="sticker" style={{ width: "1rem", height: "1rem", fontSize: "0.6rem" }}>💩</span>
          {fmt(data.poopPerDay)}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Page heading */}
      <h1
        className="text-5xl font-bold mb-6 text-ink"
        style={{ fontFamily: "var(--font-caveat), cursive" }}
      >
        <span className="sticker mr-2" style={{ width: "2rem", height: "2rem", fontSize: "1.1rem" }}>📊</span>
        Analytics
      </h1>

      {/* Period selector — looks like tabbed notebook dividers */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {PERIODS.map((p) => (
          <button
            key={p.days}
            className={`btn btn-sm btn-stamp ${activeDays === p.days ? "btn-primary" : "btn-ghost border border-paper-darker"}`}
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: "1rem",
              letterSpacing: "0.02em",
            }}
            onClick={() => setActiveDays(p.days)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Stat cards — scrapbook paper tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statValues.map((stat, i) => {
          const meta = STAT_META[i];
          return (
            <div
              key={meta.label}
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: meta.bg,
                borderColor: meta.borderColor,
                boxShadow: "2px 3px 8px rgba(100, 70, 50, 0.10)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="sticker"
                  style={{ width: "1.75rem", height: "1.75rem", fontSize: "0.9rem", backgroundColor: "white" }}
                >
                  {meta.emoji}
                </span>
                <span
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "#9e9080", fontFamily: "var(--font-nunito), sans-serif" }}
                >
                  {meta.label}
                </span>
              </div>
              <div
                className="text-3xl font-bold text-ink leading-tight"
                style={{ fontFamily: "var(--font-caveat), cursive" }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: "#9e9080", fontFamily: "var(--font-nunito), sans-serif" }}
              >
                {stat.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts — white scrapbook cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="card-scrapbook p-5">
          <h2
            className="text-2xl font-bold text-ink mb-4"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            <span className="sticker mr-1.5" style={{ width: "1.5rem", height: "1.5rem", fontSize: "0.8rem" }}>🍽️</span>
            Feedings by Type
          </h2>
          <div className="h-64">
            <Bar data={feedingChartData} options={chartOptions} />
          </div>
        </div>

        <div className="card-scrapbook p-5">
          <h2
            className="text-2xl font-bold text-ink mb-4"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            <span className="sticker mr-1.5" style={{ width: "1.5rem", height: "1.5rem", fontSize: "0.8rem" }}>👶</span>
            Diaper Changes
          </h2>
          <div className="h-64">
            <Line data={diaperChartData} options={chartOptions} />
          </div>
        </div>

        <div className="card-scrapbook p-5 lg:col-span-2">
          <h2
            className="text-2xl font-bold text-ink mb-4"
            style={{ fontFamily: "var(--font-caveat), cursive" }}
          >
            <span className="sticker mr-1.5" style={{ width: "1.5rem", height: "1.5rem", fontSize: "0.8rem" }}>🍼</span>
            Bottle Volume (ml)
          </h2>
          <div className="h-64">
            <Line data={volumeChartData} options={chartOptions} />
          </div>
        </div>

      </div>
    </div>
  );
}
