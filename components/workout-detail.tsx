"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Dumbbell,
  Plus,
  Trash2,
  Copy,
  CalendarIcon,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Workout, Exercise } from "@/lib/types";
import {
  getWorkout,
  deleteWorkout,
  createWorkout,
  addOrUpdateExercise,
} from "@/lib/workout-service";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ExerciseItem from "@/components/exercise-item";

export function WorkoutDetail({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCopying, setIsCopying] = useState(false);
  const [copyDate, setCopyDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedWorkout, setEditedWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const data = await getWorkout(id);
        setWorkout(data);
        setEditedWorkout(data);
      } catch (error) {
        toast({
          title: "Error loading workout",
          description: "Please try again later",
          variant: "destructive",
        });
        router.push("/dashboard");
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
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error deleting workout",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    if (!editedWorkout) return;

    try {
      const updatedExercises = editedWorkout.exercises.filter(
        (ex) => ex.id !== exerciseId
      );
      setEditedWorkout({
        ...editedWorkout,
        exercises: updatedExercises,
        totalSets: updatedExercises.reduce(
          (total, ex) => total + ex.sets.length,
          0
        ),
      });
    } catch (error) {
      toast({
        title: "Error removing exercise",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleUpdateExercise = async (updatedExercise: Exercise) => {
    if (!editedWorkout) return;

    try {
      const updatedExercises = editedWorkout.exercises.map((ex) =>
        ex.id === updatedExercise.id ? updatedExercise : ex
      );
      setEditedWorkout({
        ...editedWorkout,
        exercises: updatedExercises,
        totalSets: updatedExercises.reduce(
          (total, ex) => total + ex.sets.length,
          0
        ),
      });
    } catch (error) {
      toast({
        title: "Error updating exercise",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleAddExercise = async (newExercise: Exercise) => {
    if (!editedWorkout) return;

    try {
      const updatedExercises = [...editedWorkout.exercises, newExercise];
      setEditedWorkout({
        ...editedWorkout,
        exercises: updatedExercises,
        totalSets: updatedExercises.reduce(
          (total, ex) => total + ex.sets.length,
          0
        ),
      });
    } catch (error) {
      toast({
        title: "Error adding exercise",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!editedWorkout) return;

    try {
      // Update the workout with the edited data
      const response = await fetch(`/api/workouts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedWorkout),
      });

      if (!response.ok) {
        throw new Error("Failed to update workout");
      }

      const updatedWorkout = await response.json();
      setWorkout(updatedWorkout);
      setEditedWorkout(updatedWorkout);
      setIsEditing(false);

      toast({
        title: "Workout updated",
        description: "Your changes have been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error saving workout",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditedWorkout(workout);
    setIsEditing(false);
  };

  const handleCopyWorkout = async () => {
    if (!workout) return;

    setIsCopying(true);
    try {
      // Create a new workout with the same exercises but selected date
      const newWorkout = await createWorkout({
        name: `${workout.name} (Copy)`,
        date: copyDate.toISOString(),
        exercises: workout.exercises.map((exercise) => ({
          ...exercise,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // Generate new ID
        })),
        totalSets: workout.totalSets,
      });

      toast({
        title: "Workout copied",
        description: "Your workout has been copied successfully",
      });

      // Close the dialog and navigate to the new workout
      setCopyDialogOpen(false);
      router.push(`/workout/${newWorkout.id}`);
    } catch (error) {
      toast({
        title: "Error copying workout",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="w-1/2 h-8 mb-6 rounded bg-muted"></div>
        <div className="h-40 mb-6 rounded bg-muted"></div>
        <div className="w-1/4 h-6 mb-4 rounded bg-muted"></div>
        <div className="h-32 rounded bg-muted"></div>
      </div>
    );
  }

  if (!workout || !editedWorkout) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col gap-2 px-2 pt-4 pb-4 mb-4 border-b rounded-t-lg border-zinc-800 sm:flex-row sm:items-center sm:justify-between bg-zinc-900/40">
        <div className="flex items-start flex-1 gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="mt-1 mr-2"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="mb-1 text-3xl font-extrabold leading-tight">
              {workout.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{format(new Date(workout.date), "PPP")}</span>
              <span>·</span>
              <span>{workout.totalSets} sets</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="w-4 h-4" />
              Edit Workout
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={handleCancelEdit}
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                className="gap-1"
                onClick={handleSave}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(workout.date), "PPP")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Dumbbell className="w-4 h-4" />
              <span>{workout.totalSets}</span>
              <span>sets</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <div className="flex flex-col justify-between gap-2 mb-4 sm:flex-row sm:items-center sm:gap-0">
          <h2 className="text-xl font-semibold">Exercises</h2>
          <div className="flex gap-2">
            <Dialog open={copyDialogOpen} onOpenChange={setCopyDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Copy className="w-4 h-4" />
                  Copy Workout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Copy Workout</DialogTitle>
                  <DialogDescription>
                    Choose a date for the copied workout
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start w-full font-normal text-left"
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {format(copyDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={copyDate}
                        onSelect={(date) => {
                          if (date) {
                            setCopyDate(date);
                            setCalendarOpen(false);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCopyDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCopyWorkout} disabled={isCopying}>
                    {isCopying ? "Copying..." : "Copy Workout"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => router.push(`/workout/${id}/select-exercise`)}
              >
                <Plus className="w-4 h-4" />
                Add Exercise
              </Button>
            )}
          </div>
        </div>

        {editedWorkout.exercises.length === 0 ? (
          <Card className="bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center h-40 pt-6 text-center">
              <Plus className="w-10 h-10 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">No exercises added</h3>
              <p className="text-muted-foreground">
                Add exercises to your workout
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {editedWorkout.exercises.map((exercise) => (
              <ExerciseItem
                key={exercise.id}
                exercise={exercise}
                onRemove={handleDeleteExercise}
                onUpdate={handleUpdateExercise}
                readOnly={!isEditing}
              />
            ))}
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="fixed left-0 right-0 flex justify-center bottom-16">
          <div className="w-full max-w-md px-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="lg"
                  className="w-full gap-2"
                >
                  <Trash2 className="w-5 h-5" />
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
      )}
    </>
  );
}

