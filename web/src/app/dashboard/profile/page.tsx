"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [units, setUnits] = useState("metric");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setHeight(user.height_cm?.toString() || "");
      setWeight(user.weight_kg?.toString() || "");
      setUnits(user.units || "metric");
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual update logic
    console.log("Profile update:", { name, email, height, weight, units });
    alert("Profile update feature coming soon!");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Personal Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled
            />
            <p className="text-sm text-slate-500 mt-1">Email cannot be changed</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-slate-700 mb-2">
                Height (cm)
              </label>
              <input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-slate-700 mb-2">
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="75"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="units" className="block text-sm font-medium text-slate-700 mb-2">
              Units
            </label>
            <select
              id="units"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="metric">Metric (kg, cm)</option>
              <option value="imperial">Imperial (lbs, in)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
