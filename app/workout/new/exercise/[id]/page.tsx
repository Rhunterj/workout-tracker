"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Exercise, Set } from "@/lib/types";
import { addOrUpdateExercise, getExerciseById } from "@/lib/workout-service";
import MainNav from "@/components/main-nav";

export default function ExercisePage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const isNewExercise = searchParams.get("new") === "true";
  const initialName = searchParams.get("name") || "";

  const [exercise, setExercise] = useState<Exercise>({
    id: params.id,
    name: initialName,
    sets: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If it's not a new exercise, try to load existing data
    if (!isNewExercise) {
      const loadExercise = async () => {
        try {
          const data = await getExerciseById(params.id);
          if (data) {
            setExercise(data);
          }
        } catch (error) {
          toast({
            title: "Error loading exercise",
            description: "Please try again later",
            variant: "destructive",
          });
          router.push("/workout/new");
        }
      };
      loadExercise();
    } else if (exercise.sets.length === 0) {
      // For new exercises, add an initial empty set
      addSet();
    }
  }, [isNewExercise, params.id, router, toast]);

  const addSet = () => {
    const newSet: Set = {
      id: Date.now().toString(),
      reps: 0,
      weight: 0,
    };
    setExercise({ ...exercise, sets: [...exercise.sets, newSet] });
  };

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
      await addOrUpdateExercise(exercise);

      toast({
        title: "Exercise saved",
        description: "Your exercise has been added to the workout",
      });
      router.push("/workout/new");
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
    <main className="container max-w-md mx-auto p-4 pb-24">
      <div className="flex items-center mb-6">
        <Link href="/workout/new">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
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
            <Plus className="h-4 w-4" />
            Add Set
          </Button>
        </div>

        {exercise.sets.length === 0 ? (
          <Card className="bg-muted/50">
            <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-40">
              <Plus className="h-10 w-10 mb-4 text-muted-foreground" />
              <h3 className="font-medium text-lg">No sets added</h3>
              <p className="text-muted-foreground">Add sets to your exercise</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2 text-sm text-muted-foreground px-2">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Weight (kg)</div>
              <div className="col-span-5">Reps</div>
              <div className="col-span-1"></div>
            </div>

            {exercise.sets.map((set, setIndex) => (
              <div
                key={set.id}
                className="grid grid-cols-12 gap-2 items-center"
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
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeSet(set.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-16 left-0 right-0 flex justify-center">
        <div className="w-full max-w-md px-4 flex gap-2">
          <Button
            variant="outline"
            size="lg"
            className="w-1/3"
            onClick={() => router.push("/workout/new")}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            className="w-2/3 gap-2"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Save className="h-5 w-5" />
            Save Exercise
          </Button>
        </div>
      </div>
      <MainNav />
    </main>
  );
}

