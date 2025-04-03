import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ExerciseProgressChart from "@/components/exercise-progress-chart";
import { format } from "date-fns";

vi.mock("recharts", () => ({
  Line: () => null,
  LineChart: ({
    data,
    children,
  }: {
    data: any[];
    children: React.ReactNode;
  }) => (
    <div data-testid="line-chart" data-points={data.length}>
      {children}
    </div>
  ),
  CartesianGrid: () => null,
  XAxis: ({
    dataKey,
    tickFormatter,
  }: {
    dataKey: string;
    tickFormatter: (value: string) => string;
  }) => (
    <div data-testid="x-axis">
      {dataKey === "date" && (
        <>
          <div data-testid="date-1">
            {format(new Date("2024-03-20"), "MMM d")}
          </div>
          <div data-testid="date-2">
            {format(new Date("2024-03-21"), "MMM d")}
          </div>
        </>
      )}
    </div>
  ),
  YAxis: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

describe("ExerciseProgressChart", () => {
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

  it("should render the chart with history data", () => {
    render(<ExerciseProgressChart history={mockHistory} />);

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("should render the chart with correct data points", () => {
    render(<ExerciseProgressChart history={mockHistory} />);

    const chart = screen.getByTestId("line-chart");
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveAttribute("data-points", "2");
  });

  it("should format dates correctly in the chart", () => {
    render(<ExerciseProgressChart history={mockHistory} />);

    expect(screen.getByTestId("date-1")).toHaveTextContent("Mar 20");
    expect(screen.getByTestId("date-2")).toHaveTextContent("Mar 21");
  });
});

