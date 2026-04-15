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
        <div className="alert alert-warning">
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
        backgroundColor: "rgba(99, 179, 237, 0.7)",
        borderRadius: 4,
      },
      {
        label: "Breast",
        data: data.daily.map((d) => d.breast),
        backgroundColor: "rgba(246, 135, 179, 0.7)",
        borderRadius: 4,
      },
    ],
  };

  const diaperChartData = {
    labels,
    datasets: [
      {
        label: "Pee",
        data: data.daily.map((d) => d.pee),
        borderColor: "rgb(99, 179, 237)",
        backgroundColor: "rgba(99, 179, 237, 0.1)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "Poop",
        data: data.daily.map((d) => d.poop),
        borderColor: "rgb(180, 142, 99)",
        backgroundColor: "rgba(180, 142, 99, 0.1)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const volumeChartData = {
    labels,
    datasets: [
      {
        label: "Bottle ml",
        data: data.daily.map((d) => d.bottleMl),
        borderColor: "rgb(99, 179, 237)",
        backgroundColor: "rgba(99, 179, 237, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" as const },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1
        className="text-3xl font-extrabold mb-6 text-base-content"
        style={{ fontFamily: "var(--font-nunito), sans-serif" }}
      >
        Analytics
      </h1>

      {/* Period Tabs */}
      <div className="tabs tabs-boxed mb-8 inline-flex bg-base-200 border border-base-300">
        {PERIODS.map((p) => (
          <button
            key={p.days}
            className={`tab font-semibold transition-colors ${activeDays === p.days ? "tab-active" : "hover:text-primary"}`}
            onClick={() => setActiveDays(p.days)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="stat bg-base-100 rounded-box shadow-sm border border-base-300">
          <div className="stat-title text-base-content/50 text-xs font-semibold uppercase tracking-wide">Feedings / Day</div>
          <div className="stat-value text-primary" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>{fmt(data.feedingsPerDay)}</div>
          <div className="stat-desc text-base-content/50">{data.totalFeedings} total</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow-sm border border-base-300">
          <div className="stat-title text-base-content/50 text-xs font-semibold uppercase tracking-wide">Avg Bottle</div>
          <div className="stat-value text-info" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>{fmt(data.avgBottleMl)} ml</div>
          <div className="stat-desc text-base-content/50">{data.bottleCount} feedings</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow-sm border border-base-300">
          <div className="stat-title text-base-content/50 text-xs font-semibold uppercase tracking-wide">Avg Breast</div>
          <div className="stat-value text-secondary" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>{fmt(data.avgBreastMin)} min</div>
          <div className="stat-desc text-base-content/50">{data.breastCount} feedings</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow-sm border border-base-300">
          <div className="stat-title text-base-content/50 text-xs font-semibold uppercase tracking-wide">Diapers / Day</div>
          <div className="stat-value text-accent" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
            {fmt(data.peePerDay + data.poopPerDay)}
          </div>
          <div className="stat-desc text-base-content/50">
            💧 {data.peePerDay} &middot; 💩 {data.poopPerDay}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h2
              className="card-title text-base text-base-content"
              style={{ fontFamily: "var(--font-nunito), sans-serif" }}
            >
              Feedings by Type
            </h2>
            <div className="h-64">
              <Bar data={feedingChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h2
              className="card-title text-base text-base-content"
              style={{ fontFamily: "var(--font-nunito), sans-serif" }}
            >
              Diaper Changes
            </h2>
            <div className="h-64">
              <Line data={diaperChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300 lg:col-span-2">
          <div className="card-body">
            <h2
              className="card-title text-base text-base-content"
              style={{ fontFamily: "var(--font-nunito), sans-serif" }}
            >
              Bottle Volume (ml)
            </h2>
            <div className="h-64">
              <Line data={volumeChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
