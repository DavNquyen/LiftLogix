"use client";

import { useState, useEffect } from "react";
import { bodyWeight } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BodyWeightEntry {
  id: number;
  user_id: number;
  weight_kg: number;
  date: string;
  notes?: string;
}

export default function BodyWeightPage() {
  const [entries, setEntries] = useState<BodyWeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await bodyWeight.list();
      setEntries(data);
    } catch (err) {
      console.error("Failed to load body weight data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;

    try {
      await bodyWeight.create({
        weight_kg: parseFloat(weight),
        notes: notes || undefined,
      });
      setWeight("");
      setNotes("");
      await loadData();
    } catch (err) {
      alert("Failed to log body weight");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await bodyWeight.delete(id);
      await loadData();
      setDeleteConfirm(null);
    } catch (err) {
      alert("Failed to delete entry");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Prepare chart data (reverse for chronological order)
  const chartData = [...entries].reverse().slice(-30).map(entry => ({
    date: formatDate(entry.date),
    weight: entry.weight_kg,
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-zinc-400 font-bold">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-5xl font-black text-white">BODY WEIGHT TRACKING</h1>

      {/* Log Weight Form */}
      <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
        <h2 className="text-3xl font-black text-white mb-6">LOG WEIGHT</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">
                WEIGHT (KG)
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="75.5"
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">
                NOTES (OPTIONAL)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Morning weigh-in, before breakfast..."
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-8 py-4 bg-blue-600 text-white font-black hover:bg-blue-500 transition"
          >
            LOG WEIGHT
          </button>
        </form>
      </div>

      {/* Weight Chart */}
      {chartData.length > 0 && (
        <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
          <h2 className="text-3xl font-black text-white mb-6">WEIGHT TREND</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis dataKey="date" stroke="#a1a1aa" style={{ fontSize: '12px', fontWeight: 'bold' }} />
              <YAxis stroke="#a1a1aa" style={{ fontSize: '12px', fontWeight: 'bold' }} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#27272a',
                  border: '2px solid #3f3f46',
                  borderRadius: '0',
                  color: '#fff',
                  fontWeight: 'bold',
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                name="Weight (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Entries */}
      <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
        <h2 className="text-3xl font-black text-white mb-6">WEIGHT HISTORY</h2>
        {entries.length === 0 ? (
          <p className="text-zinc-400 font-bold">NO ENTRIES YET. LOG YOUR FIRST WEIGH-IN ABOVE!</p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-zinc-800 border-2 border-zinc-700 p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-black text-white text-lg">{entry.weight_kg} KG</p>
                  <p className="text-sm text-zinc-400 font-medium">
                    {formatDate(entry.date)}
                    {entry.notes && ` • ${entry.notes}`}
                  </p>
                </div>
                {deleteConfirm === entry.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black text-sm"
                    >
                      CONFIRM
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-black text-sm"
                    >
                      CANCEL
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(entry.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold"
                  >
                    DELETE
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
