import { WorkoutDetail } from "@/components/workout-detail";

export default function WorkoutPage({ params }: { params: { id: string } }) {
  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <WorkoutDetail id={params.id} />
    </main>
  );
}

