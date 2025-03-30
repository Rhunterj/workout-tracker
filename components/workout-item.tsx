import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Workout } from "@/lib/types"

interface WorkoutItemProps {
  workout: Workout
}

export default function WorkoutItem({ workout }: WorkoutItemProps) {
  return (
    <Link key={workout.id} href={`/workout/${workout.id}`}>
      <Card className="hover:bg-accent/50 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{workout.name}</CardTitle>
          <CardDescription>{formatDistanceToNow(new Date(workout.date), { addSuffix: true })}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-1">
            {workout.exercises.map((exercise) => (
              <Badge key={exercise.id} variant="secondary">
                {exercise.name}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {workout.exercises.length} exercises · {workout.totalSets} sets
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

