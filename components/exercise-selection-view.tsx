"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Exercise } from "@/lib/types";
import { getExerciseLibrary } from "@/lib/exercise-library";
import { getWorkouts } from "@/lib/workout-service";

export function ExerciseSelectionView() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentExercises, setRecentExercises] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const exerciseLibrary = getExerciseLibrary();

  useEffect(() => {
    // Load recent exercises the user has done before
    const loadRecentExercises = async () => {
      try {
        // Get all workouts and extract unique exercise names
        const workouts = await getWorkouts();
        const exerciseNames = new Set<string>();

        workouts.forEach((workout) => {
          workout.exercises.forEach((exercise) => {
            exerciseNames.add(exercise.name);
          });
        });

        setRecentExercises(Array.from(exerciseNames).slice(0, 5));
      } catch (error) {
        console.error("Error loading recent exercises", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentExercises();
  }, []);

  const filteredExercises = exerciseLibrary.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectExercise = (exercise: {
    name: string;
    muscleGroup: string;
  }) => {
    // Create a new exercise with a unique ID
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exercise.name,
      sets: [], // Start with no sets
    };

    // Navigate to the exercise detail page to add sets
    router.push(
      `/workout/new/exercise/${newExercise.id}?name=${encodeURIComponent(
        exercise.name
      )}&new=true`
    );
  };

  const handleCreateCustom = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Exercise name required",
        description: "Please enter a name for your custom exercise",
        variant: "destructive",
      });
      return;
    }

    // Create a new custom exercise
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: searchQuery.trim(),
      sets: [], // Start with no sets
    };

    // Navigate to the exercise detail page to add sets
    router.push(
      `/workout/new/exercise/${newExercise.id}?name=${encodeURIComponent(
        newExercise.name
      )}&new=true`
    );
  };

  return (
    <>
      <div className="flex items-center mb-6">
        <Link href="/workout/new">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Select Exercise</h1>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {!loading && recentExercises.length > 0 && searchQuery === "" && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Recent Exercises</h2>
          <div className="space-y-2">
            {recentExercises.map((name) => (
              <Card
                key={name}
                className="hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => handleSelectExercise({ name, muscleGroup: "" })}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-sm text-muted-foreground">
                      Previously performed
                    </div>
                  </div>
                  <Link
                    href={`/exercise/${encodeURIComponent(name)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-sm text-primary"
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span>Progress</span>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Exercise Library</h2>
        </div>

        {filteredExercises.length === 0 ? (
          <Card className="bg-muted/50 mb-4">
            <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-40">
              <p className="text-muted-foreground">No exercises found</p>
              <Button className="mt-4 gap-1" onClick={handleCreateCustom}>
                <Plus className="h-4 w-4" />
                Create "{searchQuery}"
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2 mb-4">
            {filteredExercises.map((exercise) => (
              <Card
                key={exercise.name}
                className="hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => handleSelectExercise(exercise)}
              >
                <CardContent className="p-4">
                  <div className="font-medium">{exercise.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {exercise.muscleGroup}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Button
          variant="outline"
          className="w-full gap-1"
          onClick={handleCreateCustom}
        >
          <Plus className="h-4 w-4" />
          Add Custom Exercise
        </Button>
      </div>
    </>
  );
}

