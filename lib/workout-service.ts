"use client";

import type { Exercise, ExerciseHistory, Workout } from "./types";

// LOCAL STORAGE IS STILL USED FOR THE *CURRENT*, UNSAVED WORKOUT
const CURRENT_WORKOUT_KEY = "workout-tracker-current";

// Helper to get current workout in progress (remains client-side)
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

// Helper to save current workout in progress (remains client-side)
export const saveCurrentWorkout = (data: { exercises: Exercise[] }): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CURRENT_WORKOUT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving current workout to localStorage", error);
  }
};

// --- API-BASED FUNCTIONS ---

// Helper function for making API requests
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`API Error (${res.status}): ${errorBody}`);
    throw new Error(`API request failed: ${res.statusText}`);
  }
  // Handle 204 No Content specifically for DELETE requests
  if (res.status === 204) {
    return undefined as T; // Or null, depending on how you want to handle it
  }
  return res.json() as Promise<T>;
}

// Get all workouts from the API
export const getWorkouts = async (): Promise<Workout[]> => {
  return fetchApi<Workout[]>("/api/workouts");
};

// Get a single workout by ID from the API
export const getWorkout = async (id: string): Promise<Workout | null> => {
  try {
    const workout = await fetchApi<Workout>(`/api/workouts/${id}`);
    return workout;
  } catch (error) {
    // Handle cases like 404 Not Found gracefully
    console.error(`Error fetching workout ${id}:`, error);
    // You might want to check the error type or status code here
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

  // Clear the current workout in progress from localStorage after successful creation
  saveCurrentWorkout({ exercises: [] });

  return newWorkout;
};

// Delete a workout via the API
export const deleteWorkout = async (id: string): Promise<void> => {
  await fetchApi<void>(`/api/workouts/${id}`, {
    method: "DELETE",
  });
};

// --- FUNCTIONS OPERATING ON THE *CURRENT* WORKOUT (using localStorage) ---

// Add or update an exercise in the current workout (remains client-side)
export const addOrUpdateExercise = async (
  exercise: Exercise
): Promise<void> => {
  // Simulate async behavior if needed, but logic is synchronous localStorage access
  // await new Promise((resolve) => setTimeout(resolve, 50)); // Optional small delay

  const currentWorkout = getCurrentWorkout();

  // Check if the exercise already exists
  const existingIndex = currentWorkout.exercises.findIndex(
    (ex) => ex.id === exercise.id
  );

  if (existingIndex >= 0) {
    // Update existing exercise
    currentWorkout.exercises[existingIndex] = exercise;
  } else {
    // Add new exercise
    currentWorkout.exercises.push(exercise);
  }

  saveCurrentWorkout(currentWorkout);
};

// Get an exercise by ID from the current workout (remains client-side)
export const getExerciseById = async (id: string): Promise<Exercise | null> => {
  // Simulate async behavior if needed
  // await new Promise((resolve) => setTimeout(resolve, 50)); // Optional small delay

  const currentWorkout = getCurrentWorkout();
  return currentWorkout.exercises.find((ex) => ex.id === id) || null;
};

// Get all exercises from the current workout (remains client-side)
export const getCurrentExercises = async (): Promise<Exercise[]> => {
  // Simulate async behavior if needed
  // await new Promise((resolve) => setTimeout(resolve, 50)); // Optional small delay

  const currentWorkout = getCurrentWorkout();
  return currentWorkout.exercises;
};

// --- API-BASED HISTORY FUNCTION ---

// Get exercise history across all workouts from the API
export const getExerciseHistory = async (
  exerciseName: string
): Promise<ExerciseHistory[]> => {
  // Encode the exercise name for the URL path
  const encodedName = encodeURIComponent(exerciseName);
  return fetchApi<ExerciseHistory[]>(`/api/exercises/history/${encodedName}`);
};

// Get all exercises from the API
export const getExercises = async (): Promise<Exercise[]> => {
  return fetchApi<Exercise[]>("/api/exercises");
};

