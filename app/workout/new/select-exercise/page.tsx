import { ExerciseSelectionView } from "@/components/exercise-selection-view";
import MainNavWrapper from "@/components/main-nav-wrapper";

export default function SelectExercisePage() {
  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <ExerciseSelectionView />
      <MainNavWrapper />
    </main>
  );
}

