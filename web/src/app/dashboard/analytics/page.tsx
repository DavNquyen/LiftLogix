"use client";

import { useState, useEffect } from "react";
import { stats } from "@/lib/api";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AnalyticsData {
  data: Array<{
    date: string;
    volume: number;
    workouts: number;
  }>;
  total_workouts: number;
  total_volume: number;
}

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await stats.analytics(timeRange);
      setAnalyticsData(data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = analyticsData?.data.map(d => ({
    ...d,
    date: formatDate(d.date)
  })) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-zinc-400 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData || analyticsData.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="text-center">
          <div className="text-8xl mb-6">📊</div>
          <h1 className="text-4xl font-black text-white mb-4">NO DATA YET</h1>
          <p className="text-xl text-zinc-400 max-w-md">
            Start logging workouts to see your progress over time!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tight">ANALYTICS</h1>
          <p className="text-zinc-400 mt-2 text-lg font-medium">Track your progress over time</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange(7)}
            className={`px-4 py-2 font-bold ${
              timeRange === 7
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            7 DAYS
          </button>
          <button
            onClick={() => setTimeRange(30)}
            className={`px-4 py-2 font-bold ${
              timeRange === 30
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            30 DAYS
          </button>
          <button
            onClick={() => setTimeRange(90)}
            className={`px-4 py-2 font-bold ${
              timeRange === 90
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            90 DAYS
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
          <p className="text-zinc-500 text-sm font-bold tracking-wide mb-2">TOTAL WORKOUTS</p>
          <p className="text-6xl font-black text-blue-500">{analyticsData.total_workouts}</p>
          <p className="text-zinc-500 text-sm mt-2 font-bold">LAST {timeRange} DAYS</p>
        </div>
        <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
          <p className="text-zinc-500 text-sm font-bold tracking-wide mb-2">TOTAL VOLUME</p>
          <p className="text-6xl font-black text-orange-500">{analyticsData.total_volume.toFixed(0)}</p>
          <p className="text-zinc-500 text-sm mt-2 font-bold">KG LIFTED</p>
        </div>
      </div>

      {/* Volume Chart */}
      <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
        <h2 className="text-2xl font-black text-white mb-6">VOLUME OVER TIME</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
            <XAxis
              dataKey="date"
              stroke="#71717a"
              style={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <YAxis
              stroke="#71717a"
              style={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '2px solid #3f3f46',
                borderRadius: '4px',
                color: '#fff',
                fontWeight: 'bold'
              }}
            />
            <Legend
              wrapperStyle={{
                color: '#71717a',
                fontWeight: 'bold',
                fontSize: '12px'
              }}
            />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              name="Volume (kg)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Workout Frequency Chart */}
      <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
        <h2 className="text-2xl font-black text-white mb-6">WORKOUT FREQUENCY</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
            <XAxis
              dataKey="date"
              stroke="#71717a"
              style={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <YAxis
              stroke="#71717a"
              style={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '2px solid #3f3f46',
                borderRadius: '4px',
                color: '#fff',
                fontWeight: 'bold'
              }}
            />
            <Legend
              wrapperStyle={{
                color: '#71717a',
                fontWeight: 'bold',
                fontSize: '12px'
              }}
            />
            <Bar
              dataKey="workouts"
              fill="#f97316"
              name="Workouts"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
