"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { stats, meals } from "@/lib/api";

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
  const [nutritionTotals, setNutritionTotals] = useState<{ date: string; calories: number; protein_g: number; carbs_g: number; fat_g: number } | null>(null);
  const [calorieGoal, setCalorieGoal] = useState<number | null>(null);
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [dashboardData, prsData, totalsData] = await Promise.all([
        stats.dashboard(),
        stats.prs(),
        meals.totals(),
      ]);
      setDashboardStats(dashboardData);
      setPrs(prsData.slice(0, 5)); // Show top 5 PRs
      setNutritionTotals(totalsData);
      // load calorie goal from localStorage (per-user)
      try {
        const uid = String(user?.id || "guest");
        const key = `calorie_goal_${uid}`;
        const stored = typeof window !== "undefined" ? localStorage.getItem(key) : null;
        if (stored) setCalorieGoal(Number(stored));
      } catch (e) {}
        // trigger animation when totals load
        setAnimateChart(true);
        setTimeout(() => setAnimateChart(false), 1200);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Save calorie goal helper
  const saveCalorieGoal = (value: number) => {
    const uid = String(user?.id || "guest");
    const key = `calorie_goal_${uid}`;
    localStorage.setItem(key, String(value));
    setCalorieGoal(value);
  };

  const MacroPie: React.FC<{ protein: number; carbs: number; fat: number; animate?: boolean }> = ({ protein, carbs, fat, animate = false }) => {
    const total = protein + carbs + fat || 1;
    const p = Math.round((protein / total) * 100);
    const c = Math.round((carbs / total) * 100);
    const pc = p + c;

    // control mount animation so gradient variables animate from 0 -> target
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
      if (animate) {
        // delay to ensure initial 0% applied before transition
        const id = window.setTimeout(() => setMounted(true), 50);
        return () => window.clearTimeout(id);
      }
      setMounted(true);
    }, [protein, carbs, fat, animate]);

    const vars = {
      // CSS custom properties for stops
      ["--p"]: mounted ? `${p}%` : `0%`,
      ["--pc"]: mounted ? `${pc}%` : `0%`,
      ["--c-p"]: `#60a5fa`,
      ["--c-c"]: `#fb923c`,
      ["--c-f"]: `#f43f5e`,
    } as React.CSSProperties;

    const style: React.CSSProperties = {
      width: 100,
      height: 100,
      borderRadius: 9999,
      background: `conic-gradient(var(--c-p) 0 var(--p), var(--c-c) var(--p) var(--pc), var(--c-f) var(--pc) 100%)`,
      ...vars,
    };

    return (
      <div className="flex items-center gap-4">
        <div style={style} className="shadow-sm macro-pie" />
        <div className="text-sm">
          <div className="macro-legend">
            <div className="flex items-center gap-2"><span className="dot" style={{ background: '#60a5fa' }} /> <span className="font-semibold">P</span> {protein}g ({p}%)</div>
            <div className="flex items-center gap-2"><span className="dot" style={{ background: '#fb923c' }} /> <span className="font-semibold">C</span> {carbs}g ({c}%)</div>
            <div className="flex items-center gap-2"><span className="dot" style={{ background: '#f43f5e' }} /> <span className="font-semibold">F</span> {fat}g ({100 - p - c}%)</div>
          </div>
        </div>
      </div>
    );
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

      {/* Nutrition widget */}
      <div className="bg-zinc-900 border-2 border-zinc-800 p-6 mt-6">
        <h3 className="text-xl font-black text-white mb-3 flex items-center gap-3"><span className="text-2xl">🍽️</span> TODAY'S NUTRITION</h3>
        {nutritionTotals ? (
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className={animateChart ? "animate-swivel-in" : ""}>
              <MacroPie protein={nutritionTotals.protein_g} carbs={nutritionTotals.carbs_g} fat={nutritionTotals.fat_g} animate={animateChart} />
            </div>
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-zinc-400 text-sm">Calories</p>
                  <p className="text-3xl font-black text-white">{nutritionTotals.calories} kcal</p>
                </div>
                <div className="text-right">
                  <label className="text-zinc-400 text-sm block">Daily Calorie Goal</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={calorieGoal ?? ""}
                      onChange={(e) => saveCalorieGoal(Number(e.target.value || 0))}
                      className="w-28 px-3 py-2 rounded bg-zinc-800 text-white"
                      placeholder="2000"
                    />
                    <button
                      onClick={() => saveCalorieGoal(0)}
                      className="text-sm text-zinc-400 hover:text-white"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="relative w-full bg-zinc-800 h-6 rounded-full overflow-hidden">
                  {/* filled portion */}
                  <div
                    style={{
                      width: `${Math.min(100, calorieGoal && calorieGoal > 0 ? (nutritionTotals.calories / calorieGoal) * 100 : 0)}%`,
                      ["--target-width"]: `${Math.min(100, calorieGoal && calorieGoal > 0 ? (nutritionTotals.calories / calorieGoal) * 100 : 0)}%`,
                    } as React.CSSProperties}
                    className={`${calorieGoal && calorieGoal > 0 && nutritionTotals.calories > calorieGoal ? "bg-rose-500" : "bg-emerald-400"} h-6 animate-grow`}
                  />

                  {/* goal marker */}
                  {calorieGoal && calorieGoal > 0 && (
                    (() => {
                      const maxRange = Math.max(calorieGoal, nutritionTotals.calories * 1.1, calorieGoal * 1);
                      const markerLeft = Math.min(100, (calorieGoal / maxRange) * 100);
                      return (
                        <div
                          className="goal-marker"
                          style={{ left: `${markerLeft}%`, pointerEvents: 'none' }}
                        />
                      );
                    })()
                  )}
                </div>
                <div className="flex items-center justify-between mt-2 text-sm text-zinc-400">
                  <div>{calorieGoal && calorieGoal > 0 ? `${Math.round((nutritionTotals.calories / calorieGoal) * 100)}%` : "--"}</div>
                  <div>{calorieGoal && calorieGoal > 0 ? `${nutritionTotals.calories}/${calorieGoal} kcal` : `${nutritionTotals.calories} kcal`}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-zinc-500">Loading nutrition...</p>
        )}
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
