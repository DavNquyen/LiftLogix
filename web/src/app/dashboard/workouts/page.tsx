"use client";

import { useState, useEffect } from "react";
import { exercises, workouts } from "@/lib/api";

interface Exercise {
  id: number;
  name: string;
  muscle_group?: string;
  is_user_defined: boolean;
}

interface Set {
  id?: number;
  exercise_id: number;
  weight: number;
  reps: number;
  rpe?: number;
}

interface Workout {
  id: number;
  user_id: number;
  date: string;
  notes?: string;
  sets: Set[];
}

export default function Workouts() {
  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  const [workoutList, setWorkoutList] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [showNewWorkoutForm, setShowNewWorkoutForm] = useState(false);
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [currentSets, setCurrentSets] = useState<Set[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | "">("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [rpe, setRpe] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [exercisesData, workoutsData] = await Promise.all([
        exercises.list(),
        workouts.list(),
      ]);
      setExerciseList(exercisesData);
      setWorkoutList(workoutsData);
      setError(null);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addSetToForm = () => {
    if (!selectedExerciseId || !weight || !reps) {
      alert("Please fill in all required fields");
      return;
    }

    const newSet: Set = {
      exercise_id: Number(selectedExerciseId),
      weight: parseFloat(weight),
      reps: parseInt(reps),
      rpe: rpe ? parseFloat(rpe) : undefined,
    };

    setCurrentSets([...currentSets, newSet]);
    // Reset form
    setWeight("");
    setReps("");
    setRpe("");
  };

  const removeSet = (index: number) => {
    setCurrentSets(currentSets.filter((_, i) => i !== index));
  };

  const saveWorkout = async () => {
    if (currentSets.length === 0) {
      alert("Please add at least one set");
      return;
    }

    try {
      await workouts.create({
        notes: workoutNotes || undefined,
        sets: currentSets,
      });

      // Reset form and reload data
      setShowNewWorkoutForm(false);
      setWorkoutNotes("");
      setCurrentSets([]);
      await loadData();
    } catch (err) {
      alert("Failed to save workout");
      console.error(err);
    }
  };

  const getExerciseName = (exerciseId: number) => {
    return exerciseList.find((e) => e.id === exerciseId)?.name || "Unknown";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-slate-600">Loading workouts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Workouts</h1>
        <button
          onClick={() => setShowNewWorkoutForm(!showNewWorkoutForm)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          {showNewWorkoutForm ? "Cancel" : "+ New Workout"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* New Workout Form */}
      {showNewWorkoutForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">New Workout</h2>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes (optional)
            </label>
            <input
              type="text"
              value={workoutNotes}
              onChange={(e) => setWorkoutNotes(e.target.value)}
              placeholder="e.g., Push Day A"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Add Set Form */}
          <div className="grid md:grid-cols-5 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Exercise *
              </label>
              <select
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select exercise</option>
                {exerciseList.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} {ex.muscle_group && `(${ex.muscle_group})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Weight *
              </label>
              <input
                type="number"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="kg/lbs"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Reps *
              </label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="10"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                RPE
              </label>
              <input
                type="number"
                step="0.5"
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
                placeholder="8"
                max="10"
                min="1"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={addSetToForm}
            className="mb-6 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition"
          >
            + Add Set
          </button>

          {/* Current Sets */}
          {currentSets.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                Sets ({currentSets.length})
              </h3>
              <div className="space-y-2">
                {currentSets.map((set, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-slate-900">
                        {getExerciseName(set.exercise_id)}
                      </span>
                      <span className="text-slate-600 ml-4">
                        {set.weight}kg × {set.reps} reps
                        {set.rpe && ` @ RPE ${set.rpe}`}
                      </span>
                    </div>
                    <button
                      onClick={() => removeSet(index)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              onClick={saveWorkout}
              disabled={currentSets.length === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Workout
            </button>
            <button
              onClick={() => {
                setShowNewWorkoutForm(false);
                setCurrentSets([]);
                setWorkoutNotes("");
              }}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Workout History */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Recent Workouts
        </h2>

        {workoutList.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💪</div>
            <p className="text-slate-600 text-lg">No workouts yet</p>
            <p className="text-slate-500 text-sm mt-2">
              Create your first workout to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {workoutList.map((workout) => (
              <div
                key={workout.id}
                className="p-5 bg-gradient-to-r from-slate-50 to-slate-50/50 border border-slate-200 rounded-xl"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-slate-900 text-lg">
                      {workout.notes || "Workout"}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      {formatDate(workout.date)} • {workout.sets.length} sets
                    </p>
                  </div>
                </div>

                {workout.sets.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {workout.sets.map((set, idx) => (
                      <div
                        key={set.id || idx}
                        className="flex items-center text-sm"
                      >
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium mr-3">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-slate-900 min-w-[200px]">
                          {getExerciseName(set.exercise_id)}
                        </span>
                        <span className="text-slate-600">
                          {set.weight}kg × {set.reps} reps
                          {set.rpe && ` @ RPE ${set.rpe}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
