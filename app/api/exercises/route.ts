import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getExerciseLibrary } from "@/lib/exercise-library";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const exercises = getExerciseLibrary();

  if (!exercises) {
    return NextResponse.json(
      { message: "Exercises not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(exercises, { status: 200 });
}

