"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-slate-600 mt-2 text-lg">Here's your fitness overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Current Streak</p>
              <p className="text-5xl font-bold mt-2">7</p>
              <p className="text-orange-100 text-sm mt-1">days</p>
            </div>
            <div className="text-6xl opacity-80">🔥</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Workouts This Week</p>
              <p className="text-5xl font-bold mt-2">4/5</p>
              <p className="text-indigo-100 text-sm mt-1">completed</p>
            </div>
            <div className="text-6xl opacity-80">💪</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Total Volume</p>
              <p className="text-5xl font-bold mt-2">1.2k</p>
              <p className="text-emerald-100 text-sm mt-1">kg lifted</p>
            </div>
            <div className="text-6xl opacity-80">📊</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <button className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 text-indigo-700 rounded-xl font-semibold hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-left">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💪</span>
              <div>
                <div className="font-bold">Log Workout</div>
                <div className="text-sm text-indigo-600">Track your training</div>
              </div>
            </div>
          </button>
          <button className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 text-emerald-700 rounded-xl font-semibold hover:shadow-md hover:scale-[1.02] transition-all duration-200 text-left">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🍽️</span>
              <div>
                <div className="font-bold">Log Meal</div>
                <div className="text-sm text-emerald-600">Track your nutrition</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Today's Plan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Today's Plan</h2>
        <div className="space-y-4">
          <div className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-slate-900 text-lg">Push Day A</p>
                <p className="text-slate-600 mt-1">5 exercises • 60 min</p>
              </div>
              <span className="text-2xl">💪</span>
            </div>
          </div>
          <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-slate-900 text-lg">Nutrition Goal</p>
                <p className="text-slate-600 mt-1">2,500 kcal • 180g protein</p>
              </div>
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
