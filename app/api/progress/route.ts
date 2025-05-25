import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get current month's date range
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    // Get previous month's date range
    const previousMonthStart = startOfMonth(subMonths(now, 1));
    const previousMonthEnd = endOfMonth(subMonths(now, 1));

    // Fetch workouts for current month
    const currentMonthWorkouts = await prisma.workout.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
      include: {
        exercises: true,
      },
    });

    // Fetch workouts for previous month
    const previousMonthWorkouts = await prisma.workout.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
      include: {
        exercises: true,
      },
    });

    // Calculate volume (total weight lifted)
    const calculateVolume = (workouts: any[]) => {
      return workouts.reduce((total, workout) => {
        return (
          total +
          workout.exercises.reduce((exerciseTotal: number, exercise: any) => {
            return (
              exerciseTotal +
              (exercise.sets || []).reduce((setTotal: number, set: any) => {
                return setTotal + set.weight * set.reps;
              }, 0)
            );
          }, 0)
        );
      }, 0);
    };

    // Calculate max weight for each exercise
    const calculateMaxWeights = (workouts: any[]) => {
      const maxWeights: Record<string, number> = {};

      workouts.forEach((workout) => {
        workout.exercises.forEach((exercise: any) => {
          const exerciseName = exercise.name;
          const maxWeight = Math.max(
            ...(exercise.sets || []).map((set: any) => set.weight)
          );

          if (
            !maxWeights[exerciseName] ||
            maxWeight > maxWeights[exerciseName]
          ) {
            maxWeights[exerciseName] = maxWeight;
          }
        });
      });

      return maxWeights;
    };

    // Calculate consistency (percentage of days with workouts)
    const calculateConsistency = (
      workouts: any[],
      startDate: Date,
      endDate: Date
    ) => {
      const workoutDates = new Set(
        workouts.map((w) => format(w.date, "yyyy-MM-dd"))
      );
      const totalDays =
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
      const workoutDays = workoutDates.size;

      return Math.round((workoutDays / totalDays) * 100);
    };

    // Calculate progress data
    const currentVolume = calculateVolume(currentMonthWorkouts);
    const previousVolume = calculateVolume(previousMonthWorkouts);
    const volumeChange =
      previousVolume > 0
        ? Math.round(((currentVolume - previousVolume) / previousVolume) * 100)
        : 0;

    const currentMaxWeights = calculateMaxWeights(currentMonthWorkouts);
    const previousMaxWeights = calculateMaxWeights(previousMonthWorkouts);

    // Find the exercise with the biggest improvement
    let maxWeightChange = 0;
    let maxWeightExercise = "";

    Object.keys(currentMaxWeights).forEach((exerciseName) => {
      const currentMax = currentMaxWeights[exerciseName];
      const previousMax = previousMaxWeights[exerciseName] || 0;
      const change = currentMax - previousMax;

      if (change > maxWeightChange) {
        maxWeightChange = change;
        maxWeightExercise = exerciseName;
      }
    });

    const currentConsistency = calculateConsistency(
      currentMonthWorkouts,
      currentMonthStart,
      currentMonthEnd
    );
    const previousConsistency = calculateConsistency(
      previousMonthWorkouts,
      previousMonthStart,
      previousMonthEnd
    );
    const consistencyChange = currentConsistency - previousConsistency;

    // Get strength progress for top exercises
    const strengthProgress = Object.entries(currentMaxWeights)
      .map(([name, currentMax]) => {
        const previousMax = previousMaxWeights[name] || 0;
        const change = currentMax - previousMax;
        return {
          name,
          currentMax,
          previousMax,
          change,
        };
      })
      .sort((a, b) => b.change - a.change)
      .slice(0, 5);

    return NextResponse.json({
      volume: {
        current: currentVolume,
        previous: previousVolume,
        change: volumeChange,
      },
      maxWeight: {
        current: Math.max(...Object.values(currentMaxWeights), 0),
        previous: Math.max(...Object.values(previousMaxWeights), 0),
        change: maxWeightChange,
        exercise: maxWeightExercise,
      },
      workouts: {
        current: currentMonthWorkouts.length,
        previous: previousMonthWorkouts.length,
        change: currentMonthWorkouts.length - previousMonthWorkouts.length,
      },
      consistency: {
        current: currentConsistency,
        previous: previousConsistency,
        change: consistencyChange,
      },
      strengthProgress,
    });
  } catch (error) {
    console.error("Error fetching progress data:", error);
    return NextResponse.json(
      { message: "Error fetching progress data" },
      { status: 500 }
    );
  }
}

