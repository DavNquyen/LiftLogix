// API Client for LiftLogix

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Get secure token storage (sessionStorage is more secure than localStorage)
 * sessionStorage: Cleared when tab closes, not accessible across tabs
 * localStorage: Persists forever, accessible across tabs
 */
function getTokenStorage() {
  // Use sessionStorage for better security (XSS attacks have smaller window)
  return typeof window !== 'undefined' ? sessionStorage : null;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const storage = getTokenStorage();
  const token = storage?.getItem("access_token");

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

  // Handle 204 No Content responses (e.g., DELETE)
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return null as T;
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

    // Store tokens in sessionStorage for better security
    const storage = getTokenStorage();
    if (storage) {
      storage.setItem("access_token", response.access_token);
      storage.setItem("refresh_token", response.refresh_token);
    }

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

  async updateProfile(data: {
    name?: string;
    height_cm?: number;
    weight_kg?: number;
    units?: string;
  }) {
    return fetchApi<{
      id: number;
      email: string;
      name: string;
      height_cm?: number;
      weight_kg?: number;
      units: string;
    }>("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  logout() {
    const storage = getTokenStorage();
    if (storage) {
      storage.removeItem("access_token");
      storage.removeItem("refresh_token");
    }
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
      name?: string;
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
    name?: string;
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

  async addSet(workoutId: number, setData: {
    exercise_id: number;
    weight: number;
    reps: number;
    rpe?: number;
  }) {
    return fetchApi(`/workouts/${workoutId}/sets`, {
      method: "POST",
      body: JSON.stringify(setData),
    });
  },

  async delete(workoutId: number) {
    return fetchApi(`/workouts/${workoutId}`, {
      method: "DELETE",
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

  async delete(mealId: number) {
    return fetchApi(`/meals/${mealId}`, {
      method: "DELETE",
    });
  },

  async totals(date?: string) {
    const qs = date ? `?date=${encodeURIComponent(date)}` : "";
    return fetchApi<{
      date: string;
      calories: number;
      protein_g: number;
      carbs_g: number;
      fat_g: number;
    }>(`/meals/totals${qs}`);
  },
};

// Stats API
export const stats = {
  async dashboard() {
    return fetchApi<{
      current_streak: number;
      workouts_this_week: number;
      total_volume: number;
      weekly_goal: number;
    }>("/stats/dashboard");
  },

  async analytics(days: number = 30) {
    return fetchApi<{
      data: Array<{
        date: string;
        volume: number;
        workouts: number;
      }>;
      total_workouts: number;
      total_volume: number;
    }>(`/stats/analytics?days=${days}`);
  },

  async prs() {
    return fetchApi<Array<{
      exercise_id: number;
      exercise_name: string;
      max_weight: number;
      max_reps: number;
      max_volume: number;
      date_achieved: string;
    }>>("/stats/prs");
  },
};

// Body Weight API
export const bodyWeight = {
  async list() {
    return fetchApi<Array<{
      id: number;
      user_id: number;
      weight_kg: number;
      date: string;
      notes?: string;
    }>>("/body-weight");
  },

  async create(data: {
    weight_kg: number;
    notes?: string;
  }) {
    return fetchApi("/body-weight", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async delete(id: number) {
    return fetchApi(`/body-weight/${id}`, {
      method: "DELETE",
    });
  },
};

// Workout Templates API
export const templates = {
  async list() {
    return fetchApi<Array<{
      id: number;
      name: string;
      notes?: string;
      exercises: Array<{
        exercise_id: number;
        sets: number;
        reps: number;
      }>;
      created_at: string;
    }>>("/workout-templates");
  },

  async create(data: {
    name: string;
    notes?: string;
    exercises: Array<{
      exercise_id: number;
      sets: number;
      reps: number;
    }>;
  }) {
    return fetchApi<{
      id: number;
      name: string;
      notes?: string;
      exercises: Array<{
        exercise_id: number;
        sets: number;
        reps: number;
      }>;
      created_at: string;
    }>("/workout-templates", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async get(id: number) {
    return fetchApi<{
      id: number;
      name: string;
      notes?: string;
      exercises: Array<{
        exercise_id: number;
        sets: number;
        reps: number;
      }>;
      created_at: string;
    }>(`/workout-templates/${id}`);
  },

  async delete(id: number) {
    return fetchApi(`/workout-templates/${id}`, {
      method: "DELETE",
    });
  },
};

// Social API
export const social = {
  // Friendships
  async sendFriendRequest(userId: number) {
    return fetchApi<{
      id: number;
      follower_id: number;
      following_id: number;
      status: "pending" | "accepted" | "rejected";
      created_at: string;
    }>("/friends", {
      method: "POST",
      body: JSON.stringify({ following_id: userId }),
    });
  },

  async getFriends() {
    return fetchApi<Array<{
      id: number;
      follower_id: number;
      following_id: number;
      status: "pending" | "accepted" | "rejected";
      user: {
        id: number;
        email: string;
        name: string;
        height_cm?: number;
        weight_kg?: number;
        units: string;
      };
    }>>("/friends");
  },

  async getFriendRequests() {
    return fetchApi<Array<{
      id: number;
      follower_id: number;
      following_id: number;
      status: "pending" | "accepted" | "rejected";
      user: {
        id: number;
        email: string;
        name: string;
      };
    }>>("/friends/requests");
  },

  async acceptFriendRequest(friendshipId: number) {
    return fetchApi(`/friends/${friendshipId}/accept`, {
      method: "PATCH",
    });
  },

  async removeFriend(friendshipId: number) {
    return fetchApi(`/friends/${friendshipId}`, {
      method: "DELETE",
    });
  },

  async searchUsers(query: string) {
    return fetchApi<Array<{
      id: number;
      email: string;
      name: string;
    }>>(`/users/search?query=${encodeURIComponent(query)}`);
  },

  // Workout Sharing
  async shareWorkout(workoutId: number) {
    return fetchApi<{
      id: number;
      workout_id: number;
      is_public: boolean;
      created_at: string;
    }>(`/workouts/${workoutId}/share`, {
      method: "POST",
    });
  },

  async unshareWorkout(workoutId: number) {
    return fetchApi(`/workouts/${workoutId}/share`, {
      method: "DELETE",
    });
  },

  async getFeed(skip: number = 0, limit: number = 20) {
    return fetchApi<Array<{
      id: number;
      user_id: number;
      date: string;
      name?: string;
      notes?: string;
      sets: Array<{
        id: number;
        exercise_id: number;
        weight: number;
        reps: number;
        rpe?: number;
      }>;
      user: {
        id: number;
        email: string;
        name: string;
      };
      share: {
        id: number;
        workout_id: number;
        is_public: boolean;
        created_at: string;
      };
      comments: Array<{
        id: number;
        workout_id: number;
        user_id: number;
        comment_text: string;
        created_at: string;
        user: {
          id: number;
          email: string;
          name: string;
        };
      }>;
    }>>(`/feed?skip=${skip}&limit=${limit}`);
  },

  async addComment(workoutId: number, commentText: string) {
    return fetchApi<{
      id: number;
      workout_id: number;
      user_id: number;
      comment_text: string;
      created_at: string;
      user: {
        id: number;
        email: string;
        name: string;
      };
    }>(`/workouts/${workoutId}/comments`, {
      method: "POST",
      body: JSON.stringify({ comment_text: commentText }),
    });
  },
};

// Progress Photos API
export const progressPhotos = {
  async list() {
    return fetchApi<Array<{
      id: number;
      user_id: number;
      photo_url: string;
      photo_type?: string;
      notes?: string;
      date: string;
    }>>("/progress-photos");
  },

  async upload(file: File, photoType?: string, notes?: string) {
    const formData = new FormData();
    formData.append("file", file);
    if (photoType) formData.append("photo_type", photoType);
    if (notes) formData.append("notes", notes);

    const storage = getTokenStorage();
    const token = storage?.getItem("access_token");
    const response = await fetch(`${API_URL}/progress-photos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Upload failed" }));
      throw new ApiError(response.status, error.detail);
    }

    return response.json();
  },

  async delete(id: number) {
    return fetchApi(`/progress-photos/${id}`, {
      method: "DELETE",
    });
  },
};

// Body Measurements API
export const bodyMeasurements = {
  async list() {
    return fetchApi<Array<{
      id: number;
      user_id: number;
      date: string;
      chest_cm?: number;
      waist_cm?: number;
      hips_cm?: number;
      left_bicep_cm?: number;
      right_bicep_cm?: number;
      left_thigh_cm?: number;
      right_thigh_cm?: number;
      left_calf_cm?: number;
      right_calf_cm?: number;
      neck_cm?: number;
      shoulders_cm?: number;
      notes?: string;
    }>>("/body-measurements");
  },

  async create(data: {
    chest_cm?: number;
    waist_cm?: number;
    hips_cm?: number;
    left_bicep_cm?: number;
    right_bicep_cm?: number;
    left_thigh_cm?: number;
    right_thigh_cm?: number;
    left_calf_cm?: number;
    right_calf_cm?: number;
    neck_cm?: number;
    shoulders_cm?: number;
    notes?: string;
  }) {
    return fetchApi("/body-measurements", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async delete(id: number) {
    return fetchApi(`/body-measurements/${id}`, {
      method: "DELETE",
    });
  },
};
