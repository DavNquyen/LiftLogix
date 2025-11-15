"use client";

import { useEffect, useState } from "react";
import { meals } from "@/lib/api";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface Meal {
    id: number;
    user_id: number;
    date: string;
    type: MealType;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    description?: string;
}

export default function MealsPage() {
    const [mealList, setMealList] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);

    // --- Form fields ---
    const [type, setType] = useState<MealType>("breakfast");
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fat, setFat] = useState("");
    const [description, setDescription] = useState("");

    // Load meals on mount
    useEffect(() => {
        loadMeals();
    }, []);

    async function loadMeals() {
        try {
            setLoading(true);
            const data = await meals.list();
            setMealList(data);
        } catch (err) {
            console.error("Failed to load meals:", err);
        } finally {
            setLoading(false);
        }
    }

    async function addMeal(e: React.FormEvent) {
        e.preventDefault();

        try {
            await meals.create({
                type,
                calories: Number(calories),
                protein_g: Number(protein),
                carbs_g: Number(carbs),
                fat_g: Number(fat),
                description,
            });

            // Clear form
            setCalories("");
            setProtein("");
            setCarbs("");
            setFat("");
            setDescription("");

            // Refresh list
            await loadMeals();
        } catch (err) {
            console.error("Error creating meal:", err);
            alert("Failed to save meal.");
        }
    }

    async function removeMeal(id: number) {
        if (!confirm("Delete this meal?")) return;

        try {
            await meals.delete(id);
            await loadMeals();
        } catch (err) {
            console.error("Failed to delete meal:", err);
        }
    }

    return (
        <div className="space-y-10 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-900">🍽️ Meal Tracking</h1>

            {/* --- Add Meal Form --- */}
            <div className="bg-white p-6 rounded-2xl shadow border border-slate-200">
                <h2 className="text-2xl font-semibold mb-4">Add Meal</h2>

                <form onSubmit={addMeal} className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block mb-1 text-sm">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as MealType)}
                            className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="snack">Snack</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <input
                            type="number"
                            placeholder="Calories"
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                            className="border rounded-lg px-3 py-2"
                        />
                        <input
                            type="number"
                            placeholder="Protein (g)"
                            value={protein}
                            onChange={(e) => setProtein(e.target.value)}
                            className="border rounded-lg px-3 py-2"
                        />
                        <input
                            type="number"
                            placeholder="Carbs (g)"
                            value={carbs}
                            onChange={(e) => setCarbs(e.target.value)}
                            className="border rounded-lg px-3 py-2"
                        />
                        <input
                            type="number"
                            placeholder="Fat (g)"
                            value={fat}
                            onChange={(e) => setFat(e.target.value)}
                            className="border rounded-lg px-3 py-2"
                        />
                    </div>

                    <textarea
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    />

                    <button
                        type="submit"
                        className="bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
                    >
                        Add Meal
                    </button>
                </form>
            </div>

            {/* --- Meal List --- */}
            <div>
                <h2 className="text-2xl font-semibold mb-4">Your Meals</h2>

                {loading ? (
                    <p className="text-slate-600">Loading...</p>
                ) : mealList.length === 0 ? (
                    <p className="text-slate-600">No meals logged yet.</p>
                ) : (
                    <div className="space-y-4">
                        {mealList.map((meal) => (
                            <div
                                key={meal.id}
                                className="border rounded-lg p-4 bg-white shadow-sm flex justify-between"
                            >
                                <div>
                                    <p className="font-semibold capitalize">{meal.type}</p>
                                    <p className="text-sm text-slate-500">{meal.description || ""}</p>
                                    <p className="text-sm mt-1">
                                        {meal.calories} kcal • P {meal.protein_g}g • C {meal.carbs_g}g • F{" "}
                                        {meal.fat_g}g
                                    </p>
                                </div>

                                <button
                                    onClick={() => removeMeal(meal.id)}
                                    className="text-red-500 font-bold hover:text-red-700"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}



// export default function Meals() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
//       <div className="text-center">
//         <div className="text-8xl mb-6">🍽️</div>
//         <h1 className="text-4xl font-bold text-slate-900 mb-4">Meal Tracking</h1>
//         <p className="text-xl text-slate-600 max-w-md">
//           Meal logging feature coming soon!
//         </p>
//         <p className="text-slate-500 mt-4">
//           Track your nutrition, hit your macro targets, and fuel your gains.
//         </p>
//       </div>
//     </div>
//   );
// }
