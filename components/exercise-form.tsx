"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import type { Exercise, Set } from "@/lib/types"

interface ExerciseFormProps {
  exercise: Exercise
  index: number
  onUpdate: (exercise: Exercise) => void
  onRemove: (id: string) => void
}

export default function ExerciseForm({ exercise, index, onUpdate, onRemove }: ExerciseFormProps) {
  const updateExerciseName = (name: string) => {
    onUpdate({ ...exercise, name })
  }

  const addSet = () => {
    const newSet: Set = {
      id: Date.now().toString(),
      reps: 0,
      weight: 0,
    }
    onUpdate({ ...exercise, sets: [...exercise.sets, newSet] })
  }

  const updateSet = (setId: string, field: "reps" | "weight", value: number) => {
    const updatedSets = exercise.sets.map((set) => (set.id === setId ? { ...set, [field]: value } : set))
    onUpdate({ ...exercise, sets: updatedSets })
  }

  const removeSet = (setId: string) => {
    const updatedSets = exercise.sets.filter((set) => set.id !== setId)
    onUpdate({ ...exercise, sets: updatedSets })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Exercise {index + 1}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => onRemove(exercise.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor={`exercise-name-${exercise.id}`}>Exercise Name</Label>
            <Input
              id={`exercise-name-${exercise.id}`}
              value={exercise.name}
              onChange={(e) => updateExerciseName(e.target.value)}
              placeholder="e.g., Bench Press, Squat, etc."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Sets</Label>
              <Button variant="outline" size="sm" className="h-7 gap-1" onClick={addSet}>
                <Plus className="h-3 w-3" />
                Add Set
              </Button>
            </div>

            {exercise.sets.length > 0 && (
              <div className="grid gap-2">
                <div className="grid grid-cols-12 gap-2 text-sm text-muted-foreground px-2">
                  <div className="col-span-1">#</div>
                  <div className="col-span-5">Weight</div>
                  <div className="col-span-5">Reps</div>
                </div>

                {exercise.sets.map((set, setIndex) => (
                  <div key={set.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-1 text-sm font-medium">{setIndex + 1}</div>
                    <div className="col-span-5">
                      <div className="flex items-center">
                        <Input
                          type="number"
                          value={set.weight || ""}
                          onChange={(e) => updateSet(set.id, "weight", Number(e.target.value))}
                          className="text-right"
                          min={0}
                        />
                        <span className="ml-1 text-sm text-muted-foreground">kg</span>
                      </div>
                    </div>
                    <div className="col-span-5">
                      <div className="flex items-center">
                        <Input
                          type="number"
                          value={set.reps || ""}
                          onChange={(e) => updateSet(set.id, "reps", Number(e.target.value))}
                          className="text-right"
                          min={0}
                        />
                        <span className="ml-1 text-sm text-muted-foreground">reps</span>
                      </div>
                    </div>
                    <div className="col-span-1">
                      {exercise.sets.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => removeSet(set.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

