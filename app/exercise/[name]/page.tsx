import { ExerciseProgressView } from "@/components/exercise-progress-view";
import MainNavWrapper from "@/components/main-nav-wrapper";

export default function ExerciseProgressPage({
  params,
}: {
  params: { name: string };
}) {
  const exerciseName = decodeURIComponent(params.name);

  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <ExerciseProgressView exerciseName={exerciseName} />
      <MainNavWrapper />
    </main>
  );
}
