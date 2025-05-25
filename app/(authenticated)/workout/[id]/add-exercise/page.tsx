import { ExerciseForm } from "@/components/exercise-form";

export default function AddExercisePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <ExerciseForm id={params.id} workoutId={params.id} />
    </main>
  );
}

