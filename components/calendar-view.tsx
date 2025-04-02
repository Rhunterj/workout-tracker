"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Workout } from "@/lib/types";
import { getWorkouts } from "@/lib/workout-service";
import WorkoutItem from "@/components/workout-item";
import { cn } from "@/lib/utils";

export function CalendarView() {
  const router = useRouter();
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const data = await getWorkouts();
        setWorkouts(data);
      } catch (error) {
        toast({
          title: "Error loading workouts",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, [toast]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const hasWorkoutOnDate = (date: Date) => {
    return workouts.some((workout) => isSameDay(new Date(workout.date), date));
  };

  const handleAddWorkoutForDate = () => {
    router.push(`/workout/new?date=${selectedDate.toISOString()}`);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-1/2 bg-muted rounded mb-6"></div>
        <div className="h-96 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button onClick={handleAddWorkoutForDate} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Workout
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 gap-px bg-muted">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="bg-background p-2 text-center text-sm font-medium"
              >
                {day}
              </div>
            ))}
            {monthDays.map((day, index) => {
              const hasWorkout = hasWorkoutOnDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "bg-background p-2 min-h-[100px] cursor-pointer hover:bg-muted/50",
                    isSelected && "bg-muted",
                    isCurrentDay && "border-2 border-primary"
                  )}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="text-sm font-medium mb-1">
                    {format(day, "d")}
                  </div>
                  {hasWorkout && (
                    <div className="text-xs text-primary">
                      <CalendarIcon className="h-3 w-3 inline mr-1" />
                      Workout
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Workouts for {format(selectedDate, "PPP")}
          </h2>
          <div className="space-y-4">
            {workouts
              .filter((workout) =>
                isSameDay(new Date(workout.date), selectedDate)
              )
              .map((workout) => (
                <WorkoutItem key={workout.id} workout={workout} />
              ))}
          </div>
        </div>
      )}
    </>
  );
}

