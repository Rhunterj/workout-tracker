import { WorkoutDetail } from "@/components/workout-detail";
import MainNavWrapper from "@/components/main-nav-wrapper";

export default function WorkoutDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <WorkoutDetail id={params.id} />
      <MainNavWrapper />
    </main>
  );
}
