import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import WorkoutList from "@/components/workout-list";
import { getWorkouts } from "@/lib/workout-service";

vi.mock("@/lib/workout-service", () => ({
  getWorkouts: vi.fn(),
}));

describe("WorkoutList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getWorkouts as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      []
    );
  });

  it("should render the list with initial state", async () => {
    render(<WorkoutList />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText("Workouts")).toBeInTheDocument();
  });

  it("should load and display workouts", async () => {
    const mockWorkouts = [
      {
        id: "1",
        name: "Morning Workout",
        date: new Date().toISOString(),
        exercises: [],
      },
      {
        id: "2",
        name: "Evening Workout",
        date: new Date().toISOString(),
        exercises: [],
      },
    ];

    (getWorkouts as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockWorkouts
    );

    render(<WorkoutList />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText("Morning Workout")).toBeInTheDocument();
    expect(screen.getByText("Evening Workout")).toBeInTheDocument();
  });

  it("should show loading state while fetching workouts", async () => {
    (getWorkouts as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<WorkoutList />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  it("should handle workout selection", async () => {
    const mockWorkouts = [
      {
        id: "1",
        name: "Morning Workout",
        date: new Date().toISOString(),
        exercises: [],
      },
    ];

    (getWorkouts as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockWorkouts
    );

    render(<WorkoutList />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const workoutItem = screen.getByText("Morning Workout");
    fireEvent.click(workoutItem);

    expect(workoutItem).toHaveClass("bg-accent");
  });
});

