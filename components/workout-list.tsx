"use client"

import { useState, useEffect } from "react"
import { Dumbbell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { Workout } from "@/lib/types"
import { getWorkouts } from "@/lib/workout-service"
import WorkoutItem from "@/components/workout-item"

export default function WorkoutList() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const data = await getWorkouts()
        setWorkouts(data)
      } catch (error) {
        toast({
          title: "Error loading workouts",
          description: "Please try again later",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadWorkouts()
  }, [toast])

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-5 w-1/3 bg-muted rounded mb-2"></div>
              <div className="h-4 w-1/4 bg-muted rounded mb-3"></div>
              <div className="h-4 w-2/3 bg-muted rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (workouts.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-40">
          <Dumbbell className="h-10 w-10 mb-4 text-muted-foreground" />
          <h3 className="font-medium text-lg">No workouts yet</h3>
          <p className="text-muted-foreground">Start tracking your fitness journey today</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {workouts.map((workout) => (
        <WorkoutItem key={workout.id} workout={workout} />
      ))}
    </div>
  )
}

