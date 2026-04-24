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

const STAT_META = [
  { emoji: "🍽️", bg: "#FFE5F3", borderColor: "#FF6EB4", label: "Feedings / Day" },
  { emoji: "🍼", bg: "#E0F3FF", borderColor: "#5BC4FF", label: "Avg Bottle" },
  { emoji: "🤱", bg: "#F0ECFF", borderColor: "#9B87FF", label: "Avg Breast" },
  { emoji: "👶", bg: "#FFFAE0", borderColor: "#FFE566", label: "Diapers / Day" },
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
        <div className="alert alert-warning rounded-xl" style={{ border: "2px solid #1a1a2e" }}>
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

  const feedingChartData = {
    labels,
    datasets: [
      {
        label: "Bottle",
        data: data.daily.map((d) => d.bottle),
        backgroundColor: "rgba(91, 196, 255, 0.6)",
        borderColor: "#5BC4FF",
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: "Breast",
        data: data.daily.map((d) => d.breast),
        backgroundColor: "rgba(255, 110, 180, 0.6)",
        borderColor: "#FF6EB4",
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const diaperChartData = {
    labels,
    datasets: [
      {
        label: "Pee",
        data: data.daily.map((d) => d.pee),
        borderColor: "#5BC4FF",
        backgroundColor: "rgba(91, 196, 255, 0.15)",
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointBackgroundColor: "white",
        pointBorderColor: "#5BC4FF",
        pointBorderWidth: 2.5,
        pointRadius: 4,
      },
      {
        label: "Poop",
        data: data.daily.map((d) => d.poop),
        borderColor: "#d4a800",
        backgroundColor: "rgba(255, 229, 102, 0.2)",
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointBackgroundColor: "white",
        pointBorderColor: "#d4a800",
        pointBorderWidth: 2.5,
        pointRadius: 4,
      },
    ],
  };

  const volumeChartData = {
    labels,
    datasets: [
      {
        label: "Bottle ml",
        data: data.daily.map((d) => d.bottleMl),
        borderColor: "#9B87FF",
        backgroundColor: "rgba(155, 135, 255, 0.15)",
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointBackgroundColor: "white",
        pointBorderColor: "#9B87FF",
        pointBorderWidth: 2.5,
        pointRadius: 4,
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
          color: "#1a1a2e",
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: "rgba(255,255,255,0.97)",
        borderColor: "#1a1a2e",
        borderWidth: 2,
        titleColor: "#1a1a2e",
        bodyColor: "#4a3d6b",
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(201, 184, 255, 0.4)", lineWidth: 1 },
        ticks: { color: "#7c6bb0", font: { family: "'Nunito', sans-serif", size: 11 } },
        border: { color: "#C9B8FF" },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: "#7c6bb0", font: { family: "'Nunito', sans-serif", size: 11 } },
        grid: { color: "rgba(201, 184, 255, 0.4)", lineWidth: 1 },
        border: { color: "#C9B8FF", dash: [4, 4] },
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
          <span className="mx-0.5" style={{ color: "#C9B8FF" }}>&middot;</span>
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
        className="text-5xl font-bold mb-6"
        style={{ fontFamily: "var(--font-caveat), cursive", color: "#1a1a2e" }}
      >
        <span className="sticker mr-2" style={{ width: "2rem", height: "2rem", fontSize: "1.1rem" }}>📊</span>
        Analytics
      </h1>

      {/* Period selector */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {PERIODS.map((p) => (
          <button
            key={p.days}
            className={`btn btn-sm btn-stamp ${activeDays === p.days ? "btn-primary" : "btn-ghost"}`}
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: "1rem",
              letterSpacing: "0.02em",
              ...(activeDays !== p.days ? { background: "white", color: "#1a1a2e" } : {}),
            }}
            onClick={() => setActiveDays(p.days)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statValues.map((stat, i) => {
          const meta = STAT_META[i];
          return (
            <div
              key={meta.label}
              className="rounded-xl p-4"
              style={{
                backgroundColor: meta.bg,
                border: `2.5px solid ${meta.borderColor}`,
                boxShadow: `3px 3px 0 #1a1a2e`,
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
                  style={{ color: "#7c6bb0", fontFamily: "var(--font-nunito), sans-serif" }}
                >
                  {meta.label}
                </span>
              </div>
              <div
                className="text-3xl font-bold leading-tight"
                style={{ fontFamily: "var(--font-caveat), cursive", color: "#1a1a2e" }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: "#7c6bb0", fontFamily: "var(--font-nunito), sans-serif" }}
              >
                {stat.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="card-scrapbook p-5">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: "var(--font-caveat), cursive", color: "#1a1a2e" }}
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
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: "var(--font-caveat), cursive", color: "#1a1a2e" }}
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
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: "var(--font-caveat), cursive", color: "#1a1a2e" }}
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
