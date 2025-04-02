import { ExerciseForm } from "@/components/exercise-form";
import MainNavWrapper from "@/components/main-nav-wrapper";

export default function ExercisePage({ params }: { params: { id: string } }) {
  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <ExerciseForm id={params.id} />
      <MainNavWrapper />
    </main>
  );
}
