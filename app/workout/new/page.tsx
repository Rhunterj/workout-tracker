import { WorkoutForm } from "@/components/workout-form";
import MainNavWrapper from "@/components/main-nav-wrapper";

export default function NewWorkoutPage() {
  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <WorkoutForm />
      <MainNavWrapper />
    </main>
  );
}

