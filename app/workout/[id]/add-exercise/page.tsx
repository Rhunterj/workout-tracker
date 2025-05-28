import { WorkoutDetail } from "@/components/workout-detail";

export default async function WorkoutPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <WorkoutDetail id={params.id} />
    </main>
  );
}

