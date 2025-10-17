// API Client for LiftLogix

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("access_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new ApiError(response.status, error.detail || "Request failed");
  }

  return response.json();
}

// Auth API
export const auth = {
  async register(data: { name: string; email: string; password: string }) {
    return fetchApi<{ id: number; email: string; name: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async login(data: { email: string; password: string }) {
    const response = await fetchApi<{
      access_token: string;
      refresh_token: string;
      token_type: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    // Store tokens
    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("refresh_token", response.refresh_token);

    return response;
  },

  async getMe() {
    return fetchApi<{
      id: number;
      email: string;
      name: string;
      height_cm?: number;
      weight_kg?: number;
      units: string;
    }>("/auth/me");
  },

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
};

// Exercises API
export const exercises = {
  async list() {
    return fetchApi<Array<{
      id: number;
      name: string;
      muscle_group?: string;
      is_user_defined: boolean;
    }>>("/exercises");
  },

  async create(data: { name: string; muscle_group?: string }) {
    return fetchApi<{
      id: number;
      name: string;
      muscle_group?: string;
      is_user_defined: boolean;
    }>("/exercises", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// Workouts API
export const workouts = {
  async list() {
    return fetchApi<Array<{
      id: number;
      user_id: number;
      date: string;
      notes?: string;
      sets: Array<{
        id: number;
        exercise_id: number;
        weight: number;
        reps: number;
        rpe?: number;
      }>;
    }>>("/workouts");
  },

  async create(data: {
    notes?: string;
    sets: Array<{
      exercise_id: number;
      weight: number;
      reps: number;
      rpe?: number;
    }>;
  }) {
    return fetchApi("/workouts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// Meals API
export const meals = {
  async list() {
    return fetchApi<Array<{
      id: number;
      user_id: number;
      date: string;
      type: "breakfast" | "lunch" | "dinner" | "snack";
      calories: number;
      protein_g: number;
      carbs_g: number;
      fat_g: number;
      description?: string;
    }>>("/meals");
  },

  async create(data: {
    type: "breakfast" | "lunch" | "dinner" | "snack";
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    description?: string;
  }) {
    return fetchApi("/meals", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
