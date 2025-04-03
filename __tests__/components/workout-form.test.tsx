import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { WorkoutForm } from "@/components/workout-form";
import { getCurrentExercises, saveCurrentWorkout } from "@/lib/workout-service";

vi.mock("@/lib/workout-service", () => ({
  getCurrentExercises: vi.fn(),
  saveCurrentWorkout: vi.fn(),
}));

describe("WorkoutForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the form with initial state", async () => {
    (
      getCurrentExercises as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce([]);

    render(<WorkoutForm />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText("Workout")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add exercise/i })
    ).toBeInTheDocument();
  });

  it("should load existing exercises on mount", async () => {
    const mockExercises = [
      { id: "1", name: "Bench Press", sets: [] },
      { id: "2", name: "Squat", sets: [] },
    ];

    (
      getCurrentExercises as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(mockExercises);

    render(<WorkoutForm />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Bench Press")).toBeInTheDocument();
      expect(screen.getByText("Squat")).toBeInTheDocument();
    });
  });

  it("should handle exercise removal", async () => {
    const mockExercises = [
      { id: "1", name: "Bench Press", sets: [] },
      { id: "2", name: "Squat", sets: [] },
    ];

    (
      getCurrentExercises as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(mockExercises);
    (
      saveCurrentWorkout as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(undefined);

    render(<WorkoutForm />);

    await waitFor(() => {
      expect(screen.getByText("Bench Press")).toBeInTheDocument();
    });

    const removeButton = screen.getByRole("button", {
      name: /remove bench press/i,
    });
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText("Bench Press")).not.toBeInTheDocument();
      expect(saveCurrentWorkout).toHaveBeenCalledWith({
        exercises: [{ id: "2", name: "Squat", sets: [] }],
      });
    });
  });

  it("should handle workout name change", async () => {
    (
      getCurrentExercises as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce([]);

    render(<WorkoutForm />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const nameInput = screen.getByRole("textbox", { name: /workout name/i });
    fireEvent.change(nameInput, { target: { value: "Morning Workout" } });

    expect(nameInput).toHaveValue("Morning Workout");
  });

  it("should handle date selection", async () => {
    (
      getCurrentExercises as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce([]);

    render(<WorkoutForm />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const dateButton = screen.getByRole("button", { name: /select date/i });
    fireEvent.click(dateButton);

    expect(screen.getByRole("grid")).toBeInTheDocument();
  });
});

