import { WorkoutDetail } from "@/components/workout-detail";

export default function AddExercisePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="container max-w-md p-4 pb-24 mx-auto">
      <WorkoutDetail id={params.id} />
    </main>
  );
}

