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
      <h1 className="text-4xl font-black text-white">WORKOUT TEMPLATES</h1>

      {/* --- Add Template Form --- */}
      <div className="bg-zinc-900 p-6 border-2 border-zinc-800">
        <h2 className="text-2xl font-bold text-white mb-4">Create Template</h2>

        <form onSubmit={addTemplate} className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-1 text-sm font-bold text-zinc-400">Template Name</label>
            <input
              type="text"
              placeholder="e.g. Push Day, Lower A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-bold text-zinc-400">Notes</label>
            <textarea
              placeholder="Optional notes (e.g. heavy bench focus)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 font-black hover:bg-blue-700 transition-colors"
          >
            SAVE TEMPLATE
          </button>
        </form>
      </div>

      {/* --- Templates List --- */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Your Templates</h2>

        {loading ? (
          <p className="text-zinc-400">Loading...</p>
        ) : templateList.length === 0 ? (
          <div className="bg-zinc-900 border-2 border-zinc-800 p-8 text-center">
            <p className="text-zinc-400">No templates saved yet.</p>
            <p className="text-zinc-500 text-sm mt-2">Create your first template above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {templateList.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-zinc-900 border-2 border-zinc-800 p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-white">{tpl.name}</p>
                  {tpl.notes && (
                    <p className="text-sm text-zinc-400 mt-1">
                      {tpl.notes}
                    </p>
                  )}
                  <p className="text-xs text-zinc-500 mt-1">
                    Created: {new Date(tpl.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => loadIntoWorkout(tpl.id)}
                    className="px-4 py-2 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors text-sm"
                  >
                    LOAD
                  </button>
                  <button
                    onClick={() => removeTemplate(tpl.id)}
                    className="px-3 py-2 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
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
