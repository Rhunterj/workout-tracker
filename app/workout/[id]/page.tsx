import { WorkoutDetail } from "@/components/workout-detail";
import MainNavWrapper from "@/components/main-nav-wrapper";

export default async function WorkoutDetailPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <WorkoutDetail id={params.id} />
      <MainNavWrapper />
    </main>
  );
}
