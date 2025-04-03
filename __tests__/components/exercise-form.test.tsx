import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ExerciseForm } from "@/components/exercise-form";
import { getExerciseById, getExercises } from "@/lib/workout-service";

// Mock the workout service
vi.mock("@/lib/workout-service", () => ({
  getExerciseById: vi.fn(),
  getExercises: vi.fn(),
}));

describe("ExerciseForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the form with initial state for new exercise", async () => {
    (getExercises as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      []
    );

    render(<ExerciseForm id="new" workoutId="1" />);

    // Check for initial elements
    expect(
      screen.getByRole("textbox", { name: /exercise name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add set/i })
    ).toBeInTheDocument();
  });

  it("should load existing exercise data", async () => {
    const mockExercise = {
      id: "1",
      name: "Bench Press",
      sets: [
        { id: "1", reps: 10, weight: 100 },
        { id: "2", reps: 12, weight: 110 },
      ],
    };

    (
      getExerciseById as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(mockExercise);
    (getExercises as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      []
    );

    render(<ExerciseForm id="1" workoutId="1" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Bench Press")).toBeInTheDocument();
      expect(screen.getByDisplayValue("10")).toBeInTheDocument();
      expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    });
  });

  it("should handle adding a new set", async () => {
    (getExercises as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      []
    );

    render(<ExerciseForm id="new" workoutId="1" />);

    const addSetButton = screen.getByRole("button", { name: /add set/i });
    fireEvent.click(addSetButton);

    await waitFor(() => {
      // Should have two set inputs (initial + new)
      const repsInputs = screen.getAllByRole("spinbutton", { name: /reps/i });
      expect(repsInputs).toHaveLength(2);
    });
  });

  it("should handle removing a set", async () => {
    const mockExercise = {
      id: "1",
      name: "Bench Press",
      sets: [
        { id: "1", reps: 10, weight: 100 },
        { id: "2", reps: 12, weight: 110 },
      ],
    };

    (
      getExerciseById as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValueOnce(mockExercise);
    (getExercises as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      []
    );

    render(<ExerciseForm id="1" workoutId="1" />);

    await waitFor(() => {
      expect(screen.getAllByRole("spinbutton", { name: /reps/i })).toHaveLength(
        2
      );
    });

    const removeButtons = screen.getAllByRole("button", {
      name: /remove set/i,
    });
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.getAllByRole("spinbutton", { name: /reps/i })).toHaveLength(
        1
      );
    });
  });

  it("should handle exercise name change", async () => {
    (getExercises as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      []
    );

    render(<ExerciseForm id="new" workoutId="1" />);

    const nameInput = screen.getByRole("textbox", { name: /exercise name/i });
    fireEvent.change(nameInput, { target: { value: "Incline Bench Press" } });

    expect(nameInput).toHaveValue("Incline Bench Press");
  });

  it("should handle set value changes", async () => {
    (getExercises as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      []
    );

    render(<ExerciseForm id="new" workoutId="1" />);

    const repsInput = screen.getByRole("spinbutton", { name: /reps/i });
    const weightInput = screen.getByRole("spinbutton", { name: /weight/i });

    fireEvent.change(repsInput, { target: { value: "12" } });
    fireEvent.change(weightInput, { target: { value: "135" } });

    expect(repsInput).toHaveValue(12);
    expect(weightInput).toHaveValue(135);
  });
});

