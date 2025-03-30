import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Workout } from "@/lib/types"; // Assuming your types are here

// GET all workouts
export async function GET() {
  try {
    const workouts = await prisma.workout.findMany({
      orderBy: {
        date: "desc", // Show newest first
      },
      include: {
        exercises: true, // Include exercises if needed, adjust as necessary
      },
    });
    return NextResponse.json(workouts);
  } catch (error) {
    console.error("Caught an error fetching workouts.");
    if (error instanceof Error) {
      console.error("Error Name:", error.name);
      console.error("Error Message:", error.message);
      if (error.stack) {
        console.error("Error Stack:", error.stack);
      }
    } else {
      console.error("Raw error object (not an Error instance):", error);
    }
    return NextResponse.json(
      { message: "Error fetching workouts" },
      { status: 500 }
    );
  }
}

// POST a new workout
export async function POST(request: Request) {
  try {
    const body: Workout = await request.json();

    // Basic validation
    if (!body.name || !body.date || !body.exercises) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newWorkout = await prisma.workout.create({
      data: {
        name: body.name,
        date: new Date(body.date), // Ensure date is a Date object
        notes: body.notes,
        // Create exercises along with the workout
        exercises: {
          create: body.exercises.map((ex) => ({
            name: ex.name,
            notes: ex.notes,
            // Prisma expects the 'sets' Json field to be valid JSON
            // Ensure your Set type is serializable
            sets: ex.sets as any, // Cast might be needed depending on Set type definition vs Prisma.JsonValue
          })),
        },
      },
      include: {
        exercises: true, // Return the created exercises
      },
    });
    return NextResponse.json(newWorkout, { status: 201 });
  } catch (error) {
    console.error("Error creating workout:", error);
    // Check for Prisma-specific errors if needed
    return NextResponse.json(
      { message: "Error creating workout" },
      { status: 500 }
    );
  }
}

