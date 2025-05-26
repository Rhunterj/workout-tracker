"use client";

import type { Exercise, ExerciseHistory, Workout } from "./types";

const CURRENT_WORKOUT_KEY = "workout-tracker-current";

const getCurrentWorkout = (): { exercises: Exercise[] } => {
  if (typeof window === "undefined") return { exercises: [] };

  try {
    const data = localStorage.getItem(CURRENT_WORKOUT_KEY);
    return data ? JSON.parse(data) : { exercises: [] };
  } catch (error) {
    console.error("Error reading current workout from localStorage", error);
    return { exercises: [] };
  }
};

export const saveCurrentWorkout = (data: { exercises: Exercise[] }): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CURRENT_WORKOUT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving current workout to localStorage", error);
  }
};

export const addOrUpdateExercise = async (
  exercise: Exercise,
  workoutId?: string
): Promise<void> => {
  const currentWorkout = getCurrentWorkout();
  const existingIndex = currentWorkout.exercises.findIndex(
    (ex) => ex.id === exercise.id
  );

  if (existingIndex >= 0) {
    currentWorkout.exercises[existingIndex] = exercise;
  } else {
    currentWorkout.exercises.push(exercise);
  }

  saveCurrentWorkout(currentWorkout);

  // If workoutId is provided, update the workout in the database
  if (workoutId) {
    try {
      const workout = await getWorkout(workoutId);
      if (workout) {
        const updatedWorkout = {
          ...workout,
          exercises: currentWorkout.exercises,
        };
        await fetchApi<Workout>(`/api/workouts/${workoutId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedWorkout),
        });
      }
    } catch (error) {
      console.error("Error updating workout:", error);
      throw error;
    }
  }
};

export const getExerciseById = async (id: string): Promise<Exercise | null> => {
  const currentWorkout = getCurrentWorkout();
  return currentWorkout.exercises.find((ex) => ex.id === id) || null;
};

export const getCurrentExercises = async (): Promise<Exercise[]> => {
  const currentWorkout = getCurrentWorkout();
  return currentWorkout.exercises;
};

// --- API-BASED FUNCTIONS ---
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });
  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`API Error (${res.status}): ${errorBody}`);
    throw new Error(`API request failed: ${res.statusText}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export const getWorkouts = async (): Promise<Workout[]> => {
  return fetchApi<Workout[]>("/api/workouts");
};

export const getWorkout = async (id: string): Promise<Workout | null> => {
  try {
    const workout = await fetchApi<Workout>(`/api/workouts/${id}`);
    return workout;
  } catch (error) {
    console.error(`Error fetching workout ${id}:`, error);
    return null;
  }
};

// Create a new workout via the API
export const createWorkout = async (
  workoutData: Omit<Workout, "id" | "createdAt" | "updatedAt">
): Promise<Workout> => {
  const newWorkout = await fetchApi<Workout>("/api/workouts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workoutData),
  });

  saveCurrentWorkout({ exercises: [] });

  return newWorkout;
};

export const deleteWorkout = async (id: string): Promise<void> => {
  await fetchApi<void>(`/api/workouts/${id}`, {
    method: "DELETE",
  });
};

export const getExerciseHistory = async (
  exerciseName: string
): Promise<ExerciseHistory[]> => {
  const encodedName = encodeURIComponent(exerciseName);
  return fetchApi<ExerciseHistory[]>(`/api/exercises/history/${encodedName}`);
};

export const getExercises = async (): Promise<Exercise[]> => {
  return fetchApi<Exercise[]>("/api/exercises");
};

