import { ExerciseForm } from "@/components/exercise-form";
import MainNavWrapper from "@/components/main-nav-wrapper";

interface AddExerciseSetsPageProps {
  params: Promise<{
    id: string;
    exerciseId: string;
  }>;
}

export default async function AddExerciseSetsPage(props: AddExerciseSetsPageProps) {
  const params = await props.params;
  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <ExerciseForm id={params.exerciseId} workoutId={params.id} />
      <MainNavWrapper />
    </main>
  );
}

