"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { stats } from "@/lib/api";

interface DashboardStats {
  current_streak: number;
  workouts_this_week: number;
  total_volume: number;
  weekly_goal: number;
}

interface PersonalRecord {
  exercise_id: number;
  exercise_name: string;
  max_weight: number;
  max_reps: number;
  max_volume: number;
  date_achieved: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [prs, setPrs] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [dashboardData, prsData] = await Promise.all([
        stats.dashboard(),
        stats.prs(),
      ]);
      setDashboardStats(dashboardData);
      setPrs(prsData.slice(0, 5)); // Show top 5 PRs
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}k`;
    }
    return volume.toFixed(0);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-5xl font-black text-white tracking-tight">
          WELCOME BACK, {user?.name?.toUpperCase()}
        </h1>
        <p className="text-zinc-400 mt-3 text-lg font-medium">Ready to make gains?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border-2 border-zinc-800 hover:border-blue-600 p-8 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-sm font-bold tracking-wide mb-2">CURRENT STREAK</p>
              <p className="text-6xl font-black text-blue-500">
                {loading ? "..." : dashboardStats?.current_streak || 0}
              </p>
              <p className="text-zinc-500 text-sm mt-2 font-bold">DAYS</p>
            </div>
            <div className="text-7xl opacity-60">🔥</div>
          </div>
        </div>

        <div className="bg-zinc-900 border-2 border-zinc-800 hover:border-orange-600 p-8 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-sm font-bold tracking-wide mb-2">THIS WEEK</p>
              <p className="text-6xl font-black text-orange-500">
                {loading ? "..." : `${dashboardStats?.workouts_this_week || 0}/${dashboardStats?.weekly_goal || 5}`}
              </p>
              <p className="text-zinc-500 text-sm mt-2 font-bold">WORKOUTS</p>
            </div>
            <div className="text-7xl opacity-60">💪</div>
          </div>
        </div>

        <div className="bg-zinc-900 border-2 border-zinc-800 hover:border-blue-600 p-8 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-sm font-bold tracking-wide mb-2">TOTAL VOLUME</p>
              <p className="text-6xl font-black text-blue-500">
                {loading ? "..." : formatVolume(dashboardStats?.total_volume || 0)}
              </p>
              <p className="text-zinc-500 text-sm mt-2 font-bold">KG LIFTED</p>
            </div>
            <div className="text-7xl opacity-60">📊</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
        <h2 className="text-3xl font-black text-white mb-8">QUICK ACTIONS</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/dashboard/workouts")}
            className="p-8 bg-zinc-800 border-2 border-zinc-700 hover:border-blue-600 text-white font-black hover:bg-zinc-700 transition-all duration-200 text-left"
          >
            <div className="flex items-center gap-4">
              <span className="text-5xl">💪</span>
              <div>
                <div className="text-xl mb-1">LOG WORKOUT</div>
                <div className="text-sm text-zinc-500 font-medium">Track your training</div>
              </div>
            </div>
          </button>
          <button
            onClick={() => router.push("/dashboard/meals")}
            className="p-8 bg-zinc-800 border-2 border-zinc-700 hover:border-orange-600 text-white font-black hover:bg-zinc-700 transition-all duration-200 text-left"
          >
            <div className="flex items-center gap-4">
              <span className="text-5xl">🍽️</span>
              <div>
                <div className="text-xl mb-1">LOG MEAL</div>
                <div className="text-sm text-zinc-500 font-medium">Track your nutrition</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Personal Records Widget */}
      {prs.length > 0 && (
        <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-white flex items-center gap-3">
              <span className="text-4xl">🏆</span>
              PERSONAL RECORDS
            </h2>
            <button
              onClick={() => router.push("/dashboard/prs")}
              className="px-6 py-3 bg-blue-600 text-white font-black hover:bg-blue-500 transition text-sm"
            >
              VIEW ALL
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prs.map((pr) => (
              <div
                key={pr.exercise_id}
                className="bg-zinc-800 border-2 border-zinc-700 p-5 hover:border-blue-600 transition-all cursor-pointer"
                onClick={() => router.push("/dashboard/prs")}
              >
                <h3 className="text-lg font-black text-white mb-3">
                  {pr.exercise_name.toUpperCase()}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-400">MAX WEIGHT</span>
                    <span className="text-xl font-black text-blue-500">{pr.max_weight} KG</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-400">MAX REPS</span>
                    <span className="text-xl font-black text-orange-500">{pr.max_reps}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-400">MAX VOLUME</span>
                    <span className="text-xl font-black text-blue-500">{Math.round(pr.max_volume)} KG</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
