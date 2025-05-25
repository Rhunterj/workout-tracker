import { ExerciseForm } from "@/components/exercise-form";

export default async function ExercisePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <ExerciseForm id={params.id} />
    </main>
  );
}
