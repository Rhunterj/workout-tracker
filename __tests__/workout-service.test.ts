import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getWorkouts,
  getWorkout,
  getExerciseHistory,
  getExercises,
} from "@/lib/workout-service";

describe("Workout Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getWorkouts", () => {
    it("should fetch workouts successfully", async () => {
      const mockWorkouts = [
        { id: "1", name: "Workout 1", date: "2024-03-20" },
        { id: "2", name: "Workout 2", date: "2024-03-21" },
      ];

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockWorkouts),
      });

      const result = await getWorkouts();
      expect(result).toEqual(mockWorkouts);
      expect(global.fetch).toHaveBeenCalledWith("/api/workouts", undefined);
    });

    it("should handle API errors", async () => {
      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: false,
        statusText: "Internal Server Error",
      });

      await expect(getWorkouts()).rejects.toThrow(
        "API request failed: Internal Server Error"
      );
      expect(global.fetch).toHaveBeenCalledWith("/api/workouts", undefined);
    });
  });

  describe("getWorkout", () => {
    it("should fetch a single workout successfully", async () => {
      const mockWorkout = {
        id: "1",
        name: "Workout 1",
        date: "2024-03-20",
        exercises: [],
      };

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockWorkout),
      });

      const result = await getWorkout("1");
      expect(result).toEqual(mockWorkout);
      expect(global.fetch).toHaveBeenCalledWith("/api/workouts/1", undefined);
    });

    it("should return null when workout is not found", async () => {
      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await getWorkout("non-existent");
      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/workouts/non-existent",
        undefined
      );
    });
  });

  describe("getExerciseHistory", () => {
    it("should fetch exercise history successfully", async () => {
      const mockHistory = [
        { date: "2024-03-20", sets: [{ reps: 10, weight: 100 }] },
        { date: "2024-03-21", sets: [{ reps: 12, weight: 100 }] },
      ];

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockHistory),
      });

      const result = await getExerciseHistory("Bench Press");
      expect(result).toEqual(mockHistory);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/exercises/history/Bench%20Press",
        undefined
      );
    });
  });

  describe("getExercises", () => {
    it("should fetch all exercises successfully", async () => {
      const mockExercises = [
        { id: "1", name: "Bench Press" },
        { id: "2", name: "Squat" },
      ];

      (
        global.fetch as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockExercises),
      });

      const result = await getExercises();
      expect(result).toEqual(mockExercises);
      expect(global.fetch).toHaveBeenCalledWith("/api/exercises", undefined);
    });
  });
});

