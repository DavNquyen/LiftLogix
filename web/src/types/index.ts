// Type definitions for LiftLogix

export interface User {
  id: number;
  email: string;
  name: string;
  height_cm?: number;
  weight_kg?: number;
  units: "metric" | "imperial";
  created_at: string;
}

export interface Exercise {
  id: number;
  name: string;
  muscle_group?: string;
  is_user_defined: boolean;
}

export interface Set {
  id: number;
  workout_id: number;
  exercise_id: number;
  weight: number;
  reps: number;
  rpe?: number;
  created_at: string;
}

export interface Workout {
  id: number;
  user_id: number;
  plan_id?: number;
  date: string;
  notes?: string;
  sets: Set[];
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface Meal {
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

export interface Plan {
  id: number;
  user_id?: number;
  template_key?: string;
  name: string;
  level?: "beginner" | "intermediate" | "advanced";
  split?: string;
  progression_rules_json?: Record<string, any>;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
