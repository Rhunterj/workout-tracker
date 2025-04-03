import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CalendarView } from "@/components/calendar-view";
import { getWorkouts } from "@/lib/workout-service";

// Mock the workout service
vi.mock("@/lib/workout-service", () => ({
  getWorkouts: vi.fn(),
}));

describe("CalendarView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getWorkouts as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      []
    );
  });

  it("should render the calendar with initial state", async () => {
    render(<CalendarView />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: "Add Workout" })
    ).toBeInTheDocument();
  });

  it("should load and display workouts", async () => {
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

    render(<CalendarView />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText("Morning Workout")).toBeInTheDocument();
  });

  it("should handle month navigation", async () => {
    render(<CalendarView />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const prevButton = screen.getByRole("button", { name: /previous month/i });
    const nextButton = screen.getByRole("button", { name: /next month/i });

    const initialMonth = screen.getByText(
      new Date().toLocaleString("default", { month: "long" })
    );

    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(
        screen.getByText(
          new Date(
            new Date().setMonth(new Date().getMonth() + 1)
          ).toLocaleString("default", {
            month: "long",
          })
        )
      ).toBeInTheDocument();
    });

    fireEvent.click(prevButton);
    await waitFor(() => {
      expect(initialMonth).toBeInTheDocument();
    });
  });

  it("should handle workout date selection", async () => {
    render(<CalendarView />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const today = new Date();
    const todayCell = screen.getByRole("button", {
      name: today.getDate().toString(),
    });
    fireEvent.click(todayCell);

    const addButton = screen.getByRole("button", { name: /add workout/i });
    expect(addButton).not.toBeDisabled();
  });

  it("should show loading state while fetching workouts", async () => {
    (getWorkouts as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<CalendarView />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });
});

