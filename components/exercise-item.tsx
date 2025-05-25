"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, TrendingUp, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Exercise, Set } from "@/lib/types";
import Link from "next/link";
import { Plus } from "lucide-react";

interface ExerciseItemProps {
  exercise: Exercise;
  onRemove: (id: string) => void;
  onUpdate?: (exercise: Exercise) => void;
  showProgressLink?: boolean;
  readOnly?: boolean;
}

export default function ExerciseItem({
  exercise,
  onRemove,
  onUpdate,
  showProgressLink = false,
  readOnly = false,
}: ExerciseItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExercise, setEditedExercise] = useState<Exercise>(exercise);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedExercise);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedExercise(exercise);
    setIsEditing(false);
  };

  const updateSet = (
    setId: string,
    field: "reps" | "weight",
    value: number
  ) => {
    const updatedSets = editedExercise.sets.map((set) =>
      set.id === setId ? { ...set, [field]: value } : set
    );
    setEditedExercise({ ...editedExercise, sets: updatedSets });
  };

  const removeSet = (setId: string) => {
    const updatedSets = editedExercise.sets.filter((set) => set.id !== setId);
    setEditedExercise({ ...editedExercise, sets: updatedSets });
  };

  const addSet = () => {
    const newSet: Set = {
      id: Date.now().toString(),
      reps: 0,
      weight: 0,
    };
    setEditedExercise({
      ...editedExercise,
      sets: [...editedExercise.sets, newSet],
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center min-h-[32px]">
            {isEditing ? (
              <Input
                value={editedExercise.name}
                onChange={(e) =>
                  setEditedExercise({ ...editedExercise, name: e.target.value })
                }
                className="max-w-[200px]"
              />
            ) : (
              <CardTitle className="text-base flex items-center min-h-[32px]">
                {exercise.name}
              </CardTitle>
            )}
          </div>
          <div className="flex gap-1 items-center">
            {showProgressLink && (
              <Link href={`/exercise/${encodeURIComponent(exercise.name)}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <TrendingUp className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {!readOnly && !isEditing && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => onRemove(exercise.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {isEditing && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="grid grid-cols-12 gap-2 text-sm text-muted-foreground px-2 items-center">
            <div className="col-span-1 flex items-center">#</div>
            <div className="col-span-5 flex items-center">Weight</div>
            <div className="col-span-6 flex items-center">Reps</div>
          </div>
          {(isEditing ? editedExercise.sets : exercise.sets).map(
            (set, index) => (
              <div
                key={set.id}
                className="grid grid-cols-12 gap-2 text-sm px-2 items-center"
              >
                <div className="col-span-1 flex items-center">{index + 1}</div>
                <div className="col-span-5 flex items-center">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={set.weight || ""}
                      onChange={(e) =>
                        updateSet(set.id, "weight", Number(e.target.value))
                      }
                      min={0}
                      className="text-right"
                    />
                  ) : (
                    `${set.weight} kg`
                  )}
                </div>
                <div className="col-span-5 flex items-center">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={set.reps || ""}
                      onChange={(e) =>
                        updateSet(set.id, "reps", Number(e.target.value))
                      }
                      min={0}
                      className="text-right"
                    />
                  ) : (
                    `${set.reps}`
                  )}
                </div>
                {isEditing && (
                  <div className="col-span-1 flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeSet(set.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )
          )}
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 gap-1"
              onClick={addSet}
            >
              <Plus className="h-4 w-4" />
              Add Set
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

