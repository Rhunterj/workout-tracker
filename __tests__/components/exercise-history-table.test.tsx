import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ExerciseHistoryTable from "@/components/exercise-history-table";

describe("ExerciseHistoryTable", () => {
  const mockHistory = [
    {
      date: "2024-03-20",
      workoutId: "1",
      workoutName: "Morning Workout",
      maxWeight: 100,
      sets: [
        { reps: 10, weight: 100 },
        { reps: 8, weight: 95 },
      ],
    },
    {
      date: "2024-03-21",
      workoutId: "2",
      workoutName: "Evening Workout",
      maxWeight: 105,
      sets: [
        { reps: 12, weight: 105 },
        { reps: 10, weight: 100 },
      ],
    },
  ];

  it("should render the table with history data", () => {
    render(<ExerciseHistoryTable history={mockHistory} />);

    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Workout")).toBeInTheDocument();
    expect(screen.getByText("Max Weight")).toBeInTheDocument();
    expect(screen.getByText("Sets")).toBeInTheDocument();

    expect(screen.getByText("Morning Workout")).toBeInTheDocument();
    expect(screen.getByText("Evening Workout")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("105")).toBeInTheDocument();
  });

  it("should format dates correctly", () => {
    render(<ExerciseHistoryTable history={mockHistory} />);

    expect(screen.getByText("Mar 20, 2024")).toBeInTheDocument();
    expect(screen.getByText("Mar 21, 2024")).toBeInTheDocument();
  });

  it("should display sets information correctly", () => {
    render(<ExerciseHistoryTable history={mockHistory} />);

    expect(screen.getByText("10 × 100, 8 × 95")).toBeInTheDocument();
    expect(screen.getByText("12 × 105, 10 × 100")).toBeInTheDocument();
  });

  it("should render empty state when no history is provided", () => {
    render(<ExerciseHistoryTable history={[]} />);

    expect(screen.getByText("No history available")).toBeInTheDocument();
  });
});

