import { ExerciseSelectionViewWorkout } from "@/components/exercise-selection-view-workout";

export default async function SelectExercisePage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <ExerciseSelectionViewWorkout workoutId={params.id} />
    </main>
  );
}

