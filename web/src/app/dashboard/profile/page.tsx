"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/api";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [units, setUnits] = useState("metric");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setHeight(user.height_cm?.toString() || "");
      setWeight(user.weight_kg?.toString() || "");
      setUnits(user.units || "metric");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const updateData: any = {};
      if (name !== user?.name) updateData.name = name;
      if (height) updateData.height_cm = parseFloat(height);
      if (weight) updateData.weight_kg = parseFloat(weight);
      if (units !== user?.units) updateData.units = units;

      const updatedUser = await auth.updateProfile(updateData);
      setUser(updatedUser);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-zinc-400 font-bold">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-5xl font-black text-white">PROFILE SETTINGS</h1>

      {success && (
        <div className="bg-green-900 border-2 border-green-600 text-green-100 px-4 py-3 font-bold">
          PROFILE UPDATED SUCCESSFULLY!
        </div>
      )}

      {error && (
        <div className="bg-red-900 border-2 border-red-600 text-red-100 px-4 py-3 font-bold">
          {error}
        </div>
      )}

      <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
        <h2 className="text-2xl font-black text-white mb-6">PERSONAL INFORMATION</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-zinc-400 mb-2">
              FULL NAME
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600 transition-all"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-zinc-400 mb-2">
              EMAIL ADDRESS
            </label>
            <input
              id="email"
              type="email"
              value={email}
              className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-zinc-500 font-bold"
              disabled
            />
            <p className="text-xs text-zinc-500 mt-1 font-medium">Email cannot be changed</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="height" className="block text-sm font-bold text-zinc-400 mb-2">
                HEIGHT (CM)
              </label>
              <input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-bold text-zinc-400 mb-2">
                WEIGHT (KG)
              </label>
              <input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="75"
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="units" className="block text-sm font-bold text-zinc-400 mb-2">
              UNITS
            </label>
            <select
              id="units"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
            >
              <option value="metric">METRIC (KG, CM)</option>
              <option value="imperial">IMPERIAL (LBS, IN)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 font-black hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "SAVING..." : "SAVE CHANGES"}
          </button>
        </form>
      </div>
    </div>
  );
}
