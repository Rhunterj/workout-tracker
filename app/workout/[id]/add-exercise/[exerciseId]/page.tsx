import { ExerciseForm } from "@/components/exercise-form";
import MainNavWrapper from "@/components/main-nav-wrapper";

interface AddExerciseSetsPageProps {
  params: {
    id: string;
    exerciseId: string;
  };
}

export default function AddExerciseSetsPage({
  params,
}: AddExerciseSetsPageProps) {
  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <ExerciseForm id={params.exerciseId} workoutId={params.id} />
      <MainNavWrapper />
    </main>
  );
}

