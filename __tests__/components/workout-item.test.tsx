import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import WorkoutItem from "@/components/workout-item";

describe("WorkoutItem", () => {
  const mockWorkout = {
    id: "1",
    name: "Morning Workout",
    date: new Date().toISOString(),
    exercises: [
      { id: "1", name: "Bench Press", sets: [] },
      { id: "2", name: "Squat", sets: [] },
    ],
    totalSets: 0,
  };

  it("should render the workout item with correct information", () => {
    render(<WorkoutItem workout={mockWorkout} />);

    expect(screen.getByText("Morning Workout")).toBeInTheDocument();

    expect(screen.getByText("2 exercises")).toBeInTheDocument();
  });

  it("should render as a link to the workout detail page", () => {
    render(<WorkoutItem workout={mockWorkout} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/workout/${mockWorkout.id}`);
  });

  it("should display the correct date format", () => {
    const date = new Date("2024-03-20T10:00:00Z");
    const workoutWithDate = {
      ...mockWorkout,
      date: date.toISOString(),
    };

    render(<WorkoutItem workout={workoutWithDate} />);

    expect(screen.getByText(/ago/)).toBeInTheDocument();
  });

  it("should display exercise badges", () => {
    render(<WorkoutItem workout={mockWorkout} />);

    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("Squat")).toBeInTheDocument();
  });
});

