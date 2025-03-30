"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, Calendar, Dumbbell, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { Workout } from "@/lib/types"
import { getWorkout, deleteWorkout } from "@/lib/workout-service"
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
} from "@/components/ui/alert-dialog"
import ExerciseItem from "@/components/exercise-item"
import MainNav from "@/components/main-nav"

export default function WorkoutDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const data = await getWorkout(params.id)
        setWorkout(data)
      } catch (error) {
        toast({
          title: "Error loading workout",
          description: "Please try again later",
          variant: "destructive",
        })
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    loadWorkout()
  }, [params.id, router, toast])

  const handleDelete = async () => {
    try {
      await deleteWorkout(params.id)
      toast({
        title: "Workout deleted",
        description: "Your workout has been deleted successfully",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error deleting workout",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <main className="container max-w-md mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 w-1/2 bg-muted rounded mb-6"></div>
          <div className="h-6 w-1/3 bg-muted rounded mb-4"></div>
          <div className="h-40 bg-muted rounded mb-6"></div>
          <div className="h-6 w-1/4 bg-muted rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (!workout) {
    return (
      <main className="container max-w-md mx-auto p-4">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Workout Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-40">
            <p className="text-muted-foreground">This workout doesn't exist or has been deleted</p>
            <Button className="mt-4" onClick={() => router.push("/")}>
              Go Back Home
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{workout.name}</h1>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive">
              <Trash2 className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Workout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this workout? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {format(new Date(workout.date), "EEEE, MMMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {workout.exercises.length} exercises · {workout.totalSets} sets
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Exercises</h2>
        <div className="space-y-4">
          {workout.exercises.map((exercise) => (
            <ExerciseItem
              key={exercise.id}
              exercise={exercise}
              onRemove={() => {}} // No-op since we don't remove from past workouts
              showProgressLink={true}
            />
          ))}
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 flex justify-center">
        <Link href="/workout/new" className="w-full max-w-md px-4">
          <Button size="lg" className="w-full gap-2">
            <Plus className="h-5 w-5" />
            Log New Workout
          </Button>
        </Link>
      </div>

      <MainNav />
    </main>
  )
}

