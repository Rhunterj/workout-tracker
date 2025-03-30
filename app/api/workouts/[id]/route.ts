import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET a single workout by ID
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { message: "Workout ID required" },
      { status: 400 }
    );
  }

  try {
    const workout = await prisma.workout.findUnique({
      where: { id },
      include: {
        exercises: true, // Include related exercises
      },
    });

    if (!workout) {
      return NextResponse.json(
        { message: "Workout not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(workout);
  } catch (error) {
    console.error(`Error fetching workout ${id}:`, error);
    // Handle potential error if ID format is wrong for MongoDB ObjectId
    if (
      error instanceof Error &&
      error.message.includes("Malformed ObjectID")
    ) {
      return NextResponse.json(
        { message: "Invalid workout ID format" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Error fetching workout" },
      { status: 500 }
    );
  }
}

// DELETE a workout by ID
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  if (!id) {
    return NextResponse.json(
      { message: "Workout ID required" },
      { status: 400 }
    );
  }

  try {
    // Check if workout exists before deleting (optional, delete is idempotent)
    const workout = await prisma.workout.findUnique({ where: { id } });
    if (!workout) {
      return NextResponse.json(
        { message: "Workout not found" },
        { status: 404 }
      );
    }

    await prisma.workout.delete({
      where: { id },
    });
    // No content response for successful deletion
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting workout ${id}:`, error);
    // Handle potential error if ID format is wrong for MongoDB ObjectId
    if (
      error instanceof Error &&
      error.message.includes("Malformed ObjectID")
    ) {
      return NextResponse.json(
        { message: "Invalid workout ID format" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Error deleting workout" },
      { status: 500 }
    );
  }
}

