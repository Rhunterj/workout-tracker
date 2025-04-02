import { ExerciseProgressView } from "@/components/exercise-progress-view";
import MainNavWrapper from "@/components/main-nav-wrapper";

export default async function ExerciseProgressPage(props: {
  params: Promise<{ name: string }>;
}) {
  const params = await props.params;
  const exerciseName = decodeURIComponent(params.name);

  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <ExerciseProgressView exerciseName={exerciseName} />
      <MainNavWrapper />
    </main>
  );
}
