"use client";

import { useState, useEffect } from "react";
import { stats } from "@/lib/api";

interface PersonalRecord {
  exercise_id: number;
  exercise_name: string;
  max_weight: number;
  max_reps: number;
  max_volume: number;
  date_achieved: string;
}

export default function PersonalRecordsPage() {
  const [prs, setPrs] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPRs();
  }, []);

  const loadPRs = async () => {
    try {
      const data = await stats.prs();
      setPrs(data);
    } catch (err) {
      console.error("Failed to load personal records", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-zinc-400 font-bold">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-5xl font-black text-white">PERSONAL RECORDS</h1>
        <p className="text-zinc-400 font-medium mt-2">
          Your best lifts for each exercise
        </p>
      </div>

      {prs.length === 0 ? (
        <div className="bg-zinc-900 border-2 border-zinc-800 p-12 text-center">
          <p className="text-zinc-400 font-bold text-lg">
            NO PRs YET. LOG YOUR FIRST WORKOUT TO START TRACKING!
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prs.map((pr) => (
            <div
              key={pr.exercise_id}
              className="bg-zinc-900 border-2 border-zinc-800 p-6 hover:border-blue-600 transition-all"
            >
              <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                {pr.exercise_name.toUpperCase()}
              </h3>

              <div className="space-y-3">
                <div className="bg-zinc-800 border-l-4 border-blue-600 p-3">
                  <p className="text-xs font-bold text-zinc-400">MAX WEIGHT</p>
                  <p className="text-2xl font-black text-white">
                    {pr.max_weight} KG
                  </p>
                </div>

                <div className="bg-zinc-800 border-l-4 border-orange-600 p-3">
                  <p className="text-xs font-bold text-zinc-400">MAX REPS</p>
                  <p className="text-2xl font-black text-white">
                    {pr.max_reps} REPS
                  </p>
                </div>

                <div className="bg-zinc-800 border-l-4 border-blue-600 p-3">
                  <p className="text-xs font-bold text-zinc-400">MAX VOLUME</p>
                  <p className="text-2xl font-black text-white">
                    {Math.round(pr.max_volume)} KG
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t-2 border-zinc-800">
                <p className="text-xs text-zinc-500 font-medium">
                  ACHIEVED ON {formatDate(pr.date_achieved)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
