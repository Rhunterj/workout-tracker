import { ExerciseSelectionViewWorkout } from "@/components/exercise-selection-view-workout";
import MainNavWrapper from "@/components/main-nav-wrapper";

interface AddExercisePageProps {
  params: {
    id: string;
  };
}

export default function AddExercisePage({ params }: AddExercisePageProps) {
  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <ExerciseSelectionViewWorkout workoutId={params.id} />
      <MainNavWrapper />
    </main>
  );
}

