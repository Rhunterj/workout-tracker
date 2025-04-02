"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Dumbbell, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Workout } from "@/lib/types";
import { getWorkout, deleteWorkout } from "@/lib/workout-service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ExerciseItem from "@/components/exercise-item";

export function WorkoutDetail({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const data = await getWorkout(id);
        setWorkout(data);
      } catch (error) {
        toast({
          title: "Error loading workout",
          description: "Please try again later",
          variant: "destructive",
        });
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [id, router, toast]);

  const handleDelete = async () => {
    try {
      await deleteWorkout(id);
      toast({
        title: "Workout deleted",
        description: "Your workout has been deleted successfully",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Error deleting workout",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExercise = () => {
    // Implementation of handleDeleteExercise
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

  if (!workout) {
    return null;
  }

  return (
    <>
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{workout.name}</h1>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(workout.date), "PPP")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Dumbbell className="h-4 w-4" />
              <span>{workout.totalSets} sets</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Exercises</h2>
          <Link href={`/workout/${id}/add-exercise`}>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Exercise
            </Button>
          </Link>
        </div>

        {workout.exercises.length === 0 ? (
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
            {workout.exercises.map((exercise) => (
              <ExerciseItem
                key={exercise.id}
                exercise={exercise}
                onRemove={handleDeleteExercise}
                readOnly={true}
              />
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-16 left-0 right-0 flex justify-center">
        <div className="w-full max-w-md px-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="lg" className="w-full gap-2">
                <Trash2 className="h-5 w-5" />
                Delete Workout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Workout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this workout? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
}

