"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { templates } from "@/lib/api";

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

export default function TemplatesPage() {
  const [templateList, setTemplateList] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Form fields ---
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");

  const router = useRouter();

  // Load templates on mount (same pattern as meals)
  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      setLoading(true);
      const data = await templates.list();
      setTemplateList(data);
    } catch (err) {
      console.error("Failed to load templates:", err);
    } finally {
      setLoading(false);
    }
  }

  async function addTemplate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await templates.create({
        name: name.trim(),
        notes: notes.trim() || undefined,
        // you can wire actual exercises into templates later
        exercises: [],
      });

      // Clear form
      setName("");
      setNotes("");

      // Refresh list
      await loadTemplates();
    } catch (err) {
      console.error("Error creating template:", err);
      alert("Failed to save template.");
    }
  }

  async function removeTemplate(id: number) {
    if (!confirm("Delete this template?")) return;

    try {
      await templates.delete(id);
      await loadTemplates();
    } catch (err) {
      console.error("Failed to delete template:", err);
    }
  }

  function loadIntoWorkout(id: number) {
    // Navigate to workouts page, passing templateId in the query
    router.push(`/dashboard/workouts?templateId=${id}`);
  }

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-slate-900">📋 Workout Templates</h1>

      {/* --- Add Template Form --- */}
      <div className="bg-white p-6 rounded-2xl shadow border border-slate-200">
        <h2 className="text-2xl font-semibold mb-4">Create Template</h2>

        <form onSubmit={addTemplate} className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-1 text-sm">Template Name</label>
            <input
              type="text"
              placeholder="e.g. Push Day, Lower A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Notes</label>
            <textarea
              placeholder="Optional notes (e.g. heavy bench focus)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
            />
          </div>

          {/* later you could add UI here for selecting exercises, sets, reps */}

          <button
            type="submit"
            className="bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Save Template
          </button>
        </form>
      </div>

      {/* --- Templates List --- */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Templates</h2>

        {loading ? (
          <p className="text-slate-600">Loading...</p>
        ) : templateList.length === 0 ? (
          <p className="text-slate-600">No templates saved yet.</p>
        ) : (
          <div className="space-y-4">
            {templateList.map((tpl) => (
              <div
                key={tpl.id}
                className="border rounded-lg p-4 bg-white shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{tpl.name}</p>
                  {tpl.notes && (
                    <p className="text-sm text-slate-500 mt-1">
                      {tpl.notes}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    Created: {new Date(tpl.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => loadIntoWorkout(tpl.id)}
                    className="text-indigo-600 font-semibold hover:text-indigo-800 text-sm"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => removeTemplate(tpl.id)}
                    className="text-red-500 font-bold hover:text-red-700 text-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
