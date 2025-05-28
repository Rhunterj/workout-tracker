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
import { getWorkouts } from "@/lib/workout-service";

interface ExerciseTemplate {
  name: string;
  muscleGroup: string;
}

export function ExerciseSelectionView() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentExercises, setRecentExercises] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [exerciseLibrary, setExerciseLibrary] = useState<ExerciseTemplate[]>(
    []
  );

  useEffect(() => {
    // Load exercises from API
    const loadExercises = async () => {
      try {
        const response = await fetch("/api/exercises");
        if (!response.ok) {
          throw new Error("Failed to fetch exercises");
        }
        const data = await response.json();
        setExerciseLibrary(data);
      } catch (error) {
        console.error("Error loading exercises:", error);
        toast({
          title: "Error loading exercises",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };

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

    loadExercises();
    loadRecentExercises();
  }, [toast]);

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
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Select Exercise</h1>
      </div>

      <div className="relative mb-6">
        <Search className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {!loading && recentExercises.length > 0 && searchQuery === "" && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">Recent Exercises</h2>
          <div className="space-y-2">
            {recentExercises.map((name) => (
              <Card
                key={name}
                className="transition-colors cursor-pointer hover:bg-accent/50"
                onClick={() => handleSelectExercise({ name, muscleGroup: "" })}
              >
                <CardContent className="flex items-center justify-between p-4">
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
                    <TrendingUp className="w-4 h-4" />
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
          <Card className="mb-4 bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center h-40 pt-6 text-center">
              <p className="text-muted-foreground">No exercises found</p>
              <Button className="gap-1 mt-4" onClick={handleCreateCustom}>
                <Plus className="w-4 h-4" />
                Create "{searchQuery}"
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mb-4 space-y-2">
            {filteredExercises.map((exercise) => (
              <Card
                key={exercise.name}
                className="transition-colors cursor-pointer hover:bg-accent/50"
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
          <Plus className="w-4 h-4" />
          Add Custom Exercise
        </Button>
      </div>
    </>
  );
}

