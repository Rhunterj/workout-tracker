"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Exercise, Set } from "@/lib/types";
import {
  addOrUpdateExercise,
  getExerciseById,
  getExercises,
} from "@/lib/workout-service";

interface ExerciseTemplate {
  name: string;
  muscleGroup: string;
}

interface ExerciseFormProps {
  id: string;
  workoutId?: string;
}

export function ExerciseForm({ id, workoutId }: ExerciseFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const isNewExercise = searchParams.get("new") === "true";
  const initialName = searchParams.get("name") || "";

  const [exercise, setExercise] = useState<Exercise>({
    id: id,
    name: initialName,
    sets: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseLibrary, setExerciseLibrary] = useState<ExerciseTemplate[]>(
    []
  );
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("");

  const addSet = () => {
    const newSet: Set = {
      id: Date.now().toString(),
      reps: 0,
      weight: 0,
    };
    setExercise({ ...exercise, sets: [...exercise.sets, newSet] });
  };

  useEffect(() => {
    // Load exercises from API
    const loadExerciseLibrary = async () => {
      try {
        const response = await fetch("/api/exercises");
        if (!response.ok) {
          throw new Error("Failed to fetch exercises");
        }
        const data = await response.json();
        setExerciseLibrary(data);
      } catch (error) {
        console.error("Error loading exercise library:", error);
        toast({
          title: "Error loading exercise library",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };

    // Load existing exercises for the dropdown
    const loadExercises = async () => {
      try {
        const data = await getExercises();
        setExercises(data);
      } catch (error) {
        console.error("Error loading exercises:", error);
      }
    };

    // If it's not a new exercise, try to load existing data
    const loadExercise = async () => {
      if (!isNewExercise) {
        try {
          const data = await getExerciseById(id);
          if (data) {
            setExercise(data);
          }
        } catch (error) {
          toast({
            title: "Error loading exercise",
            description: "Please try again later",
            variant: "destructive",
          });
          router.push(workoutId ? `/workout/${workoutId}` : "/workout/new");
        }
      } else if (exercise.sets.length === 0) {
        // For new exercises, add an initial empty set
        addSet();
      }
    };

    loadExerciseLibrary();
    loadExercises();
    loadExercise();
  }, [isNewExercise, id, router, toast, workoutId, exercise.sets.length]);

  const updateSet = (
    setId: string,
    field: "reps" | "weight",
    value: number
  ) => {
    const updatedSets = exercise.sets.map((set) =>
      set.id === setId ? { ...set, [field]: value } : set
    );
    setExercise({ ...exercise, sets: updatedSets });
  };

  const removeSet = (setId: string) => {
    const updatedSets = exercise.sets.filter((set) => set.id !== setId);
    setExercise({ ...exercise, sets: updatedSets });
  };

  const handleExerciseSelect = (exerciseId: string) => {
    setSelectedExerciseId(exerciseId);
    const selectedExercise =
      exercises.find((e) => e.id === exerciseId) ||
      exerciseLibrary.find((e) => e.name === exerciseId);
    if (selectedExercise) {
      setExercise({
        ...exercise,
        name: selectedExercise.name,
        id: Date.now().toString(), // Generate new ID for the copy
        sets: [], // Start with no sets
      });
    }
  };

  const handleSubmit = async () => {
    if (!exercise.name.trim()) {
      toast({
        title: "Exercise name required",
        description: "Please enter a name for your exercise",
        variant: "destructive",
      });
      return;
    }

    if (exercise.sets.length === 0) {
      toast({
        title: "Sets required",
        description: "Please add at least one set",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // If we have a workoutId, we're adding to an existing workout
      if (workoutId) {
        // Update the workout directly through the API
        const response = await fetch(`/api/workouts/${workoutId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exercises: [exercise],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add exercise");
        }
      } else {
        // For new workouts, use the local state management
        await addOrUpdateExercise(exercise);
      }

      toast({
        title: "Exercise saved",
        description: "Your exercise has been added to the workout",
      });
      router.push(workoutId ? `/workout/${workoutId}` : "/workout/new");
    } catch (error) {
      toast({
        title: "Error saving exercise",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center mb-6">
        <Link href={workoutId ? `/workout/${workoutId}` : "/workout/new"}>
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {isNewExercise ? "Add Exercise" : "Edit Exercise"}
        </h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Exercise Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {isNewExercise ? (
              <div className="grid gap-2">
                <Label htmlFor="exercise-select">Select Exercise</Label>
                <Select
                  value={selectedExerciseId}
                  onValueChange={handleExerciseSelect}
                >
                  <SelectTrigger id="exercise-select">
                    <SelectValue placeholder="Select an exercise" />
                  </SelectTrigger>
                  <SelectContent>
                    {exerciseLibrary.map((exercise, index) => (
                      <SelectItem key={index} value={exercise.name}>
                        {exercise.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            <div className="grid gap-2">
              <Label htmlFor="exercise-name">Exercise Name</Label>
              <Input
                id="exercise-name"
                value={exercise.name}
                onChange={(e) =>
                  setExercise({ ...exercise, name: e.target.value })
                }
                placeholder="e.g., Bench Press, Squat, etc."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Sets</h2>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={addSet}
          >
            <Plus className="w-4 h-4" />
            Add Set
          </Button>
        </div>

        {exercise.sets.length === 0 ? (
          <Card className="bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center h-40 pt-6 text-center">
              <Plus className="w-10 h-10 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">No sets added</h3>
              <p className="text-muted-foreground">Add sets to your exercise</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2 px-2 text-sm text-muted-foreground">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Weight (kg)</div>
              <div className="col-span-5">Reps</div>
              <div className="col-span-1"></div>
            </div>

            {exercise.sets.map((set, setIndex) => (
              <div
                key={set.id}
                className="grid items-center grid-cols-12 gap-2"
              >
                <div className="col-span-1 text-sm font-medium">
                  {setIndex + 1}
                </div>
                <div className="col-span-5">
                  <Input
                    type="number"
                    value={set.weight || ""}
                    onChange={(e) =>
                      updateSet(set.id, "weight", Number(e.target.value))
                    }
                    min={0}
                    className="text-right"
                  />
                </div>
                <div className="col-span-5">
                  <Input
                    type="number"
                    value={set.reps || ""}
                    onChange={(e) =>
                      updateSet(set.id, "reps", Number(e.target.value))
                    }
                    min={0}
                    className="text-right"
                  />
                </div>
                <div className="col-span-1">
                  {exercise.sets.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-destructive"
                      onClick={() => removeSet(set.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed left-0 right-0 flex justify-center bottom-16">
        <div className="flex w-full max-w-md gap-2 px-4">
          <Button
            variant="outline"
            size="lg"
            className="w-1/3"
            onClick={() =>
              router.push(workoutId ? `/workout/${workoutId}` : "/workout/new")
            }
          >
            Cancel
          </Button>
          <Button
            size="lg"
            className="w-2/3 gap-2"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Save className="w-5 h-5" />
            Save Exercise
          </Button>
        </div>
      </div>
    </>
  );
}

