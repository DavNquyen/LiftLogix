"use client";

import { useState } from "react";
import { exercises } from "@/lib/api";

interface Props {
    onClose: () => void;
    onCreated: (created: { id: number; name: string; muscle_group?: string }) => void;
}

export default function CustomExerciseModel({ onClose, onCreated }: Props) {
    const [name, setName] = useState("");
    const [muscleGroup, setMuscleGroup] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleCreate(e?: React.FormEvent) {
        e?.preventDefault();
        if (!name.trim()) {
            alert("Enter a name for the exercise");
            return;
        }
        try {
            setLoading(true);
            const created = await exercises.create({
                name: name.trim(),
                muscle_group: muscleGroup.trim() || undefined,
            });
            onCreated(created);
            onClose();
        } catch (err) {
            console.error("Failed to create exercise", err);
            alert("Failed to create exercise");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-3">Create Custom Exercise</h3>
                <form onSubmit={handleCreate} className="space-y-3">
                    <div>
                        <label className="block text-sm text-slate-700 mb-1">Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="e.g., Banded T-Spine Rotation"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-700 mb-1">Muscle group (optional)</label>
                        <input
                            value={muscleGroup}
                            onChange={(e) => setMuscleGroup(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="e.g., Shoulders"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-zinc-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded bg-indigo-600 text-white"
                        >
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
