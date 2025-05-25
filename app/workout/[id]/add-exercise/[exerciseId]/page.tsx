import { ExerciseForm } from "@/components/exercise-form";

interface AddExerciseSetsPageProps {
  params: Promise<{
    id: string;
    exerciseId: string;
  }>;
}

export default async function AddExerciseSetsPage(
  props: AddExerciseSetsPageProps
) {
  const params = await props.params;
  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <ExerciseForm id={params.exerciseId} workoutId={params.id} />
    </main>
  );
}
