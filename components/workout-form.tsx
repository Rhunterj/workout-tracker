"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, CalendarIcon, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Exercise } from "@/lib/types";
import {
  createWorkout,
  getCurrentExercises,
  saveCurrentWorkout,
} from "@/lib/workout-service";
import ExerciseItem from "@/components/exercise-item";

export function WorkoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Get date from URL if provided, otherwise use current date
  const dateParam = searchParams.get("date");
  const initialDate = dateParam ? new Date(dateParam) : new Date();

  const [workoutName, setWorkoutName] = useState("Workout");
  const [workoutDate, setWorkoutDate] = useState<Date>(initialDate);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    // Load any exercises that were already added to the current workout
    const loadExercises = async () => {
      try {
        const data = await getCurrentExercises();
        setExercises(data);
      } catch (error) {
        console.error("Error loading exercises", error);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  const handleRemoveExercise = async (id: string) => {
    try {
      // Update both the local state and the stored exercises
      const updatedExercises = exercises.filter((ex) => ex.id !== id);
      setExercises(updatedExercises);

      // Update the stored workout
      await saveCurrentWorkout({ exercises: updatedExercises });
    } catch (error) {
      console.error("Error removing exercise", error);
      toast({
        title: "Error removing exercise",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (exercises.length === 0) {
      toast({
        title: "No exercises added",
        description: "Please add at least one exercise",
        variant: "destructive",
      });
      return;
    }

    // Validate exercises
    const invalidExercises = exercises.filter(
      (ex) => !ex.name || ex.sets.length === 0
    );
    if (invalidExercises.length > 0) {
      toast({
        title: "Invalid workout data",
        description: "Please fill in all exercise names and add sets",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createWorkout({
        name: workoutName || "Workout",
        date: workoutDate.toISOString(),
        exercises,
        totalSets: exercises.reduce((total, ex) => total + ex.sets.length, 0),
      });

      toast({
        title: "Workout saved",
        description: "Your workout has been logged successfully",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Error saving workout",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-1/2 bg-muted rounded mb-6"></div>
        <div className="h-40 bg-muted rounded mb-6"></div>
        <div className="h-6 w-1/4 bg-muted rounded mb-4"></div>
        <div className="h-32 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">New Workout</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Workout Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="workout-name">Workout Name</Label>
              <Input
                id="workout-name"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="e.g., Leg Day, Upper Body, etc."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="workout-date">Workout Date</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    id="workout-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(workoutDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={workoutDate}
                    onSelect={(date) => {
                      if (date) {
                        setWorkoutDate(date);
                        setCalendarOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Exercises</h2>
          <Link href="/workout/new/select-exercise">
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Exercise
            </Button>
          </Link>
        </div>

        {exercises.length === 0 ? (
          <Card className="bg-muted/50">
            <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-40">
              <Plus className="h-10 w-10 mb-4 text-muted-foreground" />
              <h3 className="font-medium text-lg">No exercises added</h3>
              <p className="text-muted-foreground">
                Add exercises to your workout
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <ExerciseItem
                key={exercise.id}
                exercise={exercise}
                onRemove={handleRemoveExercise}
              />
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
            onClick={() => router.push("/")}
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
            Save Workout
          </Button>
        </div>
      </div>
    </>
  );
}

