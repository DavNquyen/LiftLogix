"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exercises, workouts, templates, social } from "@/lib/api";

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
  name?: string;
  notes?: string;
  sets: Set[];
}

interface TemplateExercise {
  exercise_id: number;
  sets: number;
  reps: number;
}

interface WorkoutTemplate {
  id: number;
  name: string;
  notes?: string;
  created_at: string;
  exercises: TemplateExercise[];
}

export default function Workouts() {
  const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
  const [workoutList, setWorkoutList] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [showNewWorkoutForm, setShowNewWorkoutForm] = useState(false);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [currentSets, setCurrentSets] = useState<Set[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | "">("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [rpe, setRpe] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    loadData();
  }, []);

  // When there's a templateId in the query, load it into the form
  useEffect(() => {
    const templateIdParam = searchParams.get("templateId");
    if (!templateIdParam) return;

    const id = Number(templateIdParam);
    if (Number.isNaN(id)) return;

    loadTemplateIntoForm(id);
  }, [searchParams]);

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

  const loadTemplateIntoForm = async (templateId: number) => {
    try {
      setError(null);
      const tpl = (await templates.get(templateId)) as WorkoutTemplate;

      // Open the new workout form
      setShowNewWorkoutForm(true);

      // Fill in name/notes from template
      setWorkoutName(tpl.name);
      setWorkoutNotes(tpl.notes || "");

      // Build sets from template exercises:
      // For each { exercise_id, sets, reps }, create "sets" rows with weight 0
      const generatedSets: Set[] = [];
      tpl.exercises.forEach((te) => {
        for (let i = 0; i < te.sets; i++) {
          generatedSets.push({
            exercise_id: te.exercise_id,
            weight: 0,
            reps: te.reps,
          });
        }
      });

      setCurrentSets(generatedSets);
    } catch (err) {
      console.error("Failed to load template:", err);
      setError("Failed to load template into workout form");
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
        name: workoutName || undefined,
        notes: workoutNotes || undefined,
        sets: currentSets,
      });

      // Reset form and reload data
      setShowNewWorkoutForm(false);
      setWorkoutName("");
      setWorkoutNotes("");
      setCurrentSets([]);
      await loadData();
    } catch (err) {
      alert("Failed to save workout");
      console.error(err);
    }
  };

  const deleteWorkout = async (workoutId: number) => {
    try {
      await workouts.delete(workoutId);
      await loadData();
      setDeleteConfirm(null);
    } catch (err) {
      alert("Failed to delete workout");
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
          <p className="text-zinc-400">Loading workouts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-5xl font-black text-white">WORKOUTS</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard/templates")}
            className="px-6 py-3 bg-zinc-800 border border-zinc-600 text-white font-black hover:bg-zinc-700 transition-all"
          >
            LOAD TEMPLATE
          </button>
          <button
            onClick={() => setShowNewWorkoutForm(!showNewWorkoutForm)}
            className="px-6 py-3 bg-blue-600 text-white font-black hover:bg-blue-500 transition-all"
          >
            {showNewWorkoutForm ? "CANCEL" : "+ NEW WORKOUT"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900 border-2 border-red-600 text-red-100 px-4 py-3 font-bold">
          {error}
        </div>
      )}

      {/* New Workout Form */}
      {showNewWorkoutForm && (
        <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
          <h2 className="text-3xl font-black text-white mb-8">NEW WORKOUT</h2>

          {/* Workout Name */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-zinc-400 mb-2">
              WORKOUT NAME
            </label>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="e.g., Push Day, Pull Day, Leg Day..."
              className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Exercise Selection */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-zinc-400 mb-2">
              SELECT EXERCISE
            </label>
            <select
              value={selectedExerciseId}
              onChange={(e) =>
                setSelectedExerciseId(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
            >
              <option value="">Choose an exercise...</option>
              {exerciseList.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}{" "}
                  {exercise.muscle_group && `(${exercise.muscle_group})`}
                </option>
              ))}
            </select>
          </div>

          {/* Set Details */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-zinc-400">
                  WEIGHT
                </label>
                <div className="flex border-2 border-zinc-700 bg-zinc-800">
                  <button
                    type="button"
                    onClick={() => setWeightUnit("kg")}
                    className={`px-3 py-1 text-xs font-black transition ${
                      weightUnit === "kg"
                        ? "bg-blue-600 text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    KG
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightUnit("lb")}
                    className={`px-3 py-1 text-xs font-black transition ${
                      weightUnit === "lb"
                        ? "bg-orange-600 text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    LB
                  </button>
                </div>
              </div>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">
                REPS
              </label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2">
                RPE (OPTIONAL)
              </label>
              <input
                type="number"
                step="0.5"
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
                placeholder="1-10"
                className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <button
            onClick={addSetToForm}
            className="mb-6 px-6 py-3 bg-zinc-800 border-2 border-zinc-700 hover:border-orange-600 text-white font-bold transition"
          >
            + ADD SET
          </button>

          {/* Current Sets */}
          {currentSets.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-black text-white mb-4">
                SETS FOR THIS WORKOUT:
              </h3>
              <div className="space-y-2">
                {currentSets.map((set, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-zinc-800 border-2 border-zinc-700 p-4"
                  >
                    <div className="flex gap-6">
                      <span className="font-black text-white">
                        {getExerciseName(set.exercise_id)}
                      </span>
                      <span className="text-zinc-400 font-bold">
                        {set.weight}
                        {weightUnit} × {set.reps} reps
                        {set.rpe && ` @ RPE ${set.rpe}`}
                      </span>
                    </div>
                    <button
                      onClick={() => removeSet(index)}
                      className="text-red-500 hover:text-red-400 font-bold"
                    >
                      REMOVE
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-zinc-400 mb-2">
              NOTES (OPTIONAL)
            </label>
            <textarea
              value={workoutNotes}
              onChange={(e) => setWorkoutNotes(e.target.value)}
              placeholder="Any notes about this workout..."
              rows={3}
              className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-white font-bold focus:outline-none focus:border-blue-600"
            />
          </div>

          <button
            onClick={saveWorkout}
            disabled={currentSets.length === 0}
            className="px-8 py-4 bg-blue-600 text-white font-black hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            SAVE WORKOUT
          </button>
        </div>
      )}

      {/* Recent Workouts */}
      <div className="bg-zinc-900 border-2 border-zinc-800 p-8">
        <h2 className="text-3xl font-black text-white mb-8">RECENT WORKOUTS</h2>

        {workoutList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg font-bold">NO WORKOUTS YET</p>
            <p className="text-zinc-500 text-sm mt-2 font-medium">
              Click "+ New Workout" above or load a template to log your first
              workout
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {workoutList.map((workout) => (
              <div
                key={workout.id}
                className="bg-zinc-800 border-2 border-zinc-700 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {workout.name && (
                      <h3 className="text-2xl font-black text-blue-500 mb-1">
                        {workout.name.toUpperCase()}
                      </h3>
                    )}
                    <p className="font-black text-white text-lg">
                      {formatDate(workout.date)}
                    </p>
                    {workout.notes && (
                      <p className="text-sm text-zinc-400 mt-1 font-medium">
                        {workout.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        try {
                          await social.shareWorkout(workout.id);
                          alert("Workout shared to feed!");
                        } catch (err) {
                          alert("Failed to share workout");
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold transition"
                    >
                      SHARE
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(workout.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold transition"
                    >
                      DELETE
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation Popup */}
                {deleteConfirm === workout.id && (
                  <div className="mb-4 bg-red-900 border-2 border-red-600 p-4">
                    <p className="text-white font-bold mb-4">
                      DELETE THIS WORKOUT? THIS CANNOT BE UNDONE.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteWorkout(workout.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black"
                      >
                        YES, DELETE
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-black"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {workout.sets.map((set, setIndex) => (
                    <div
                      key={setIndex}
                      className="flex justify-between items-center py-2 border-b border-zinc-700 last:border-0"
                    >
                      <span className="font-bold text-white min-w-[200px]">
                        {getExerciseName(set.exercise_id)}
                      </span>
                      <span className="text-zinc-400 font-bold">
                        {set.weight}kg × {set.reps} reps
                        {set.rpe && ` @ RPE ${set.rpe}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
