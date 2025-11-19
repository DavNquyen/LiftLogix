"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
    const [totals, setTotals] = useState<{
        date: string;
        calories: number;
        protein_g: number;
        carbs_g: number;
        fat_g: number;
    } | null>(null);
    const [calorieGoal, setCalorieGoal] = useState<number | null>(null);
    const [animateChart, setAnimateChart] = useState(false);

    const { user } = useAuth();

    // small pie component using conic gradient + animated reveal and legend dots
    const MacroPie: React.FC<{ protein: number; carbs: number; fat: number; animate?: boolean }> = ({ protein, carbs, fat, animate = false }) => {
        const total = protein + carbs + fat || 1;
        const p = Math.round((protein / total) * 100);
        const c = Math.round((carbs / total) * 100);
        const pc = p + c;

        const [mounted, setMounted] = useState(false);
        useEffect(() => {
            if (animate) {
                const id = window.setTimeout(() => setMounted(true), 50);
                return () => window.clearTimeout(id);
            }
            setMounted(true);
        }, [protein, carbs, fat, animate]);

        const vars = {
            ["--p"]: mounted ? `${p}%` : `0%`,
            ["--pc"]: mounted ? `${pc}%` : `0%`,
            ["--c-p"]: `#60a5fa`,
            ["--c-c"]: `#fb923c`,
            ["--c-f"]: `#f43f5e`,
        } as React.CSSProperties;

        const style: React.CSSProperties = {
            width: 72,
            height: 72,
            borderRadius: 9999,
            background: `conic-gradient(var(--c-p) 0 var(--p), var(--c-c) var(--p) var(--pc), var(--c-f) var(--pc) 100%)`,
            ...vars,
        };

        return (
            <div className="flex items-center gap-3">
                <div style={style} className="shadow-sm macro-pie" />
                <div className="text-sm text-white">
                    <div className="macro-legend">
                        <div className="flex items-center gap-2"><span className="dot" style={{ background: '#60a5fa' }} /> <span className="font-semibold">P</span> {protein}g ({p}%)</div>
                        <div className="flex items-center gap-2"><span className="dot" style={{ background: '#fb923c' }} /> <span className="font-semibold">C</span> {carbs}g ({c}%)</div>
                        <div className="flex items-center gap-2"><span className="dot" style={{ background: '#f43f5e' }} /> <span className="font-semibold">F</span> {fat}g ({100 - p - c}%)</div>
                    </div>
                </div>
            </div>
        );
    };

    const saveCalorieGoal = (value: number) => {
        const uid = String(user?.id || "guest");
        const key = `calorie_goal_${uid}`;
        localStorage.setItem(key, String(value));
        setCalorieGoal(value);
    };

    async function loadMeals() {
        try {
            setLoading(true);
            const [data, totalsData] = await Promise.all([meals.list(), meals.totals()]);
            setMealList(data || []);
            setTotals(totalsData || null);
        } catch (err) {
            console.error("Failed to load meals:", err);
        } finally {
            setLoading(false);
        }
    }

    async function addMeal(e: React.FormEvent) {
        e.preventDefault();
        // read values from form elements via DOM or controlled state; for simplicity, use controlled state below
    }

    // Controlled form state
    const [type, setType] = useState<MealType>("breakfast");
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fat, setFat] = useState("");
    const [description, setDescription] = useState("");

    async function handleAddMeal(e: React.FormEvent) {
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

            // clear and reload
            setCalories("");
            setProtein("");
            setCarbs("");
            setFat("");
            setDescription("");
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

    useEffect(() => {
        loadMeals();
        // load stored calorie goal
        try {
            const uid = String(user?.id || "guest");
            const key = `calorie_goal_${uid}`;
            const stored = typeof window !== "undefined" ? localStorage.getItem(key) : null;
            if (stored) setCalorieGoal(Number(stored));
        } catch (e) {}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        if (totals) {
            setAnimateChart(true);
            const t = setTimeout(() => setAnimateChart(false), 900);
            return () => clearTimeout(t);
        }
    }, [totals]);

    return (
        <div className="space-y-10 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white">🍽️ Meal Tracking</h1>

            {/* Add Meal Form */}
            <div className="bg-zinc-900 border-2 border-zinc-800 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-white">Add Meal</h2>
                    {totals && (
                        <div className="text-sm text-zinc-400">
                            Totals for {totals.date}: <span className="font-semibold text-white">{totals.calories} kcal</span>
                        </div>
                    )}
                </div>

                {totals && (
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-zinc-400">Macros</p>
                            <p className="text-lg font-bold text-white">P {totals.protein_g}g • C {totals.carbs_g}g • F {totals.fat_g}g</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className={animateChart ? "animate-swivel-in" : ""}>
                                <MacroPie protein={totals.protein_g} carbs={totals.carbs_g} fat={totals.fat_g} animate={animateChart} />
                            </div>

                            <div>
                                <label className="text-xs text-zinc-400">Daily Cal Goal</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        className="w-24 px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
                                        value={calorieGoal ?? ""}
                                        onChange={(e) => saveCalorieGoal(Number(e.target.value || 0))}
                                    />
                                </div>

                                {calorieGoal && calorieGoal > 0 && totals && (
                                    (() => {
                                        const maxRange = Math.max(calorieGoal, totals.calories * 1.1, calorieGoal * 1);
                                        const pct = Math.min(100, (totals.calories / maxRange) * 100);
                                        const markerLeft = Math.min(100, (calorieGoal / maxRange) * 100);
                                        return (
                                            <div className="mt-3">
                                                <div className="relative w-56 bg-zinc-800 h-3 rounded overflow-hidden">
                                                    <div
                                                        style={{ width: `${pct}%`, ["--target-width"]: `${pct}%` } as React.CSSProperties}
                                                        className={`${totals.calories > calorieGoal ? "bg-rose-500" : "bg-emerald-400"} h-3 animate-grow`}
                                                    />
                                                    <div className="goal-marker" style={{ left: `${markerLeft}%` }} />
                                                </div>
                                                <div className="text-xs text-zinc-400 mt-1">
                                                    {calorieGoal && calorieGoal > 0 ? `${Math.round((totals.calories / calorieGoal) * 100)}%` : "--"} • {calorieGoal && calorieGoal > 0 ? `${totals.calories}/${calorieGoal} kcal` : `${totals.calories} kcal`}
                                                </div>
                                            </div>
                                        );
                                    })()
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleAddMeal} className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block mb-1 text-sm text-zinc-300">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as MealType)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
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
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                        />
                        <input
                            type="number"
                            placeholder="Protein (g)"
                            value={protein}
                            onChange={(e) => setProtein(e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                        />
                        <input
                            type="number"
                            placeholder="Carbs (g)"
                            value={carbs}
                            onChange={(e) => setCarbs(e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                        />
                        <input
                            type="number"
                            placeholder="Fat (g)"
                            value={fat}
                            onChange={(e) => setFat(e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                        />
                    </div>

                    <textarea
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                    />

                    <button type="submit" className="bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700">
                        Add Meal
                    </button>
                </form>
            </div>

            {/* Meal List */}
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-white">Your Meals</h2>

                {loading ? (
                    <p className="text-zinc-400">Loading...</p>
                ) : mealList.length === 0 ? (
                    <p className="text-zinc-400">No meals logged yet.</p>
                ) : (
                    <div className="space-y-4">
                        {mealList.map((meal) => (
                            <div key={meal.id} className="border-2 rounded-lg p-4 bg-zinc-800 shadow-sm flex justify-between items-start border-zinc-700">
                                <div>
                                    <p className="font-semibold capitalize text-white">{meal.type}</p>
                                    <p className="text-sm text-zinc-400">{meal.description || ""}</p>
                                    <p className="text-sm mt-1 text-zinc-300">{meal.calories} kcal • P {meal.protein_g}g • C {meal.carbs_g}g • F {meal.fat_g}g</p>
                                </div>

                                <button onClick={() => removeMeal(meal.id)} className="text-rose-400 font-bold hover:text-rose-300">
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
