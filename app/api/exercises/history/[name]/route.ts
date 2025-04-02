import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Set } from "@/lib/types";

export async function GET(
  request: Request,
  props: { params: Promise<{ name: string }> }
) {
  const params = await props.params;
  // Decode the name in case it contains special characters
  const exerciseName = decodeURIComponent(params.name);

  if (!exerciseName) {
    return NextResponse.json(
      { message: "Exercise name required" },
      { status: 400 }
    );
  }

  try {
    // Find all exercises with the given name
    const exercises = await prisma.exercise.findMany({
      where: {
        name: exerciseName,
      },
      include: {
        workout: {
          select: {
            id: true,
            name: true,
            date: true,
          },
        },
      },
      orderBy: {
        workout: {
          date: "asc", // Oldest first for history
        },
      },
    });

    // Process the results to match the desired history format
    const history = exercises.map((exercise) => {
      // Parse the JSON sets data and ensure it matches the Set type
      const rawSets = exercise.sets as unknown as Array<{
        id: string;
        reps: number;
        weight: number;
      }>;
      const sets: Set[] = rawSets.map((set) => ({
        id: set.id,
        reps: set.reps,
        weight: set.weight,
      }));

      // Find max weight
      const maxWeight =
        sets.length > 0 ? Math.max(...sets.map((set) => set.weight)) : 0;

      return {
        date: exercise.workout.date,
        workoutId: exercise.workout.id,
        workoutName: exercise.workout.name,
        maxWeight,
        sets: sets,
      };
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error(
      `Error fetching history for exercise ${exerciseName}:`,
      error
    );
    return NextResponse.json(
      { message: "Error fetching exercise history" },
      { status: 500 }
    );
  }
}
