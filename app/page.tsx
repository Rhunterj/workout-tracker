import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import WorkoutList from "@/components/workout-list";
import MainNavWrapper from "@/components/main-nav-wrapper";

export default function Home() {
  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Workout Tracker</h1>
        <p className="text-muted-foreground">Track your fitness progress</p>
      </header>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Workouts</h2>
          <Link href="/workout/new">
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              New Workout
            </Button>
          </Link>
        </div>
        <WorkoutList />
      </div>

      <div className="fixed bottom-16 left-0 right-0 flex justify-center">
        <Link href="/workout/new" className="w-full max-w-md px-4">
          <Button size="lg" className="w-full gap-2">
            <PlusCircle className="h-5 w-5" />
            Log New Workout
          </Button>
        </Link>
      </div>

      <MainNavWrapper />
    </main>
  );
}

