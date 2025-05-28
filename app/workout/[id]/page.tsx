import { WorkoutDetail } from "@/components/workout-detail";

export default async function AddExercisePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  return (
    <main className="container max-w-md p-4 pb-24 mx-auto">
      <WorkoutDetail id={params.id} />
    </main>
  );
}
