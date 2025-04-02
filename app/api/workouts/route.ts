import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Workout } from "@/lib/types"; // Assuming your types are here
import { auth } from "@/auth";

// GET all workouts FOR THE LOGGED IN USER
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    // Not authenticated or session missing ID
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const workouts = await prisma.workout.findMany({
      where: {
        userId: session.user.id, // Filter by logged-in user's ID
      },
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

// POST a new workout FOR THE LOGGED IN USER
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: Omit<
      Workout,
      "id" | "createdAt" | "updatedAt" | "userId" | "user"
    > = await request.json();

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
        // Associate with the logged-in user
        userId: session.user.id,
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
    console.error("Caught an error creating workout.");
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
      { message: "Error creating workout" },
      { status: 500 }
    );
  }
}

