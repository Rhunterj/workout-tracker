import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Set } from "@/lib/types"; // Assuming Set type is here

export async function GET(request: Request, props: { params: Promise<{ name: string }> }) {
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
    // Find workouts containing the exercise
    const workouts = await prisma.workout.findMany({
      where: {
        exercises: {
          some: {
            name: exerciseName,
          },
        },
      },
      select: {
        id: true,
        name: true,
        date: true,
        exercises: {
          where: {
            name: exerciseName,
          },
          select: {
            sets: true,
          },
        },
      },
      orderBy: {
        date: "asc", // Oldest first for history
      },
    });

    // Process the results to match the desired history format
    const history = workouts.map((workout) => {
      // Should only be one matching exercise per workout based on the query
      const exercise = workout.exercises[0];
      const sets = (exercise?.sets as Set[]) || []; // Type assertion

      // Find max weight
      const maxWeight =
        sets.length > 0 ? Math.max(...sets.map((set) => set.weight)) : 0;

      return {
        date: workout.date,
        workoutId: workout.id,
        workoutName: workout.name,
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

