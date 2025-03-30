"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { Workout } from "@/lib/types"
import { getWorkouts } from "@/lib/workout-service"
import WorkoutItem from "@/components/workout-item"
import MainNav from "@/components/main-nav"

export default function CalendarPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

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

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const workoutsForSelectedDate = workouts.filter((workout) => isSameDay(new Date(workout.date), selectedDate))

  const hasWorkoutOnDate = (date: Date) => {
    return workouts.some((workout) => isSameDay(new Date(workout.date), date))
  }

  const handleAddWorkoutForDate = () => {
    // Navigate to new workout page with the selected date
    router.push(`/workout/new?date=${selectedDate.toISOString()}`)
  }

  if (loading) {
    return (
      <main className="container max-w-md mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 w-1/2 bg-muted rounded mb-6"></div>
          <div className="h-64 bg-muted rounded mb-6"></div>
          <div className="h-6 w-1/4 bg-muted rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((day, i) => {
                const hasWorkout = hasWorkoutOnDate(day)
                const isSelected = isSameDay(day, selectedDate)
                const isTodayDate = isToday(day)

                return (
                  <Button
                    key={i}
                    variant="ghost"
                    className={`h-10 w-full p-0 relative ${
                      isSelected
                        ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                        : ""
                    } ${isTodayDate && !isSelected ? "border border-primary" : ""}`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <span className="text-sm">{format(day, "d")}</span>
                    {hasWorkout && (
                      <span
                        className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                          isSelected ? "bg-primary-foreground" : "bg-primary"
                        }`}
                      ></span>
                    )}
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <span>{format(selectedDate, "MMMM d, yyyy")}</span>
          </h2>
          <Button size="sm" className="gap-1" onClick={handleAddWorkoutForDate}>
            <Plus className="h-4 w-4" />
            Add Workout
          </Button>
        </div>

        {workoutsForSelectedDate.length === 0 ? (
          <Card className="bg-muted/50">
            <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-40">
              <CalendarIcon className="h-10 w-10 mb-4 text-muted-foreground" />
              <h3 className="font-medium text-lg">No workouts on this day</h3>
              <p className="text-muted-foreground">Log a workout for this date</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {workoutsForSelectedDate.map((workout) => (
              <WorkoutItem key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </div>
      <MainNav />
    </main>
  )
}

