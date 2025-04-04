"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, TrendingUp } from "lucide-react";
import type { Exercise } from "@/lib/types";
import Link from "next/link";

interface ExerciseItemProps {
  exercise: Exercise;
  onRemove: (id: string) => void;
  showProgressLink?: boolean;
  readOnly?: boolean;
}

export default function ExerciseItem({
  exercise,
  onRemove,
  showProgressLink = false,
  readOnly = false,
}: ExerciseItemProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{exercise.name}</CardTitle>
          <div className="flex gap-1">
            {showProgressLink && (
              <Link href={`/exercise/${encodeURIComponent(exercise.name)}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <TrendingUp className="h-4 w-4" />
                </Button>
              </Link>
            )}
            {!readOnly && (
              <>
                <Link href={`/workout/new/exercise/${exercise.id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
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
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="grid grid-cols-12 gap-2 text-sm text-muted-foreground px-2">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Weight</div>
            <div className="col-span-6">Reps</div>
          </div>
          {exercise.sets.map((set, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 text-sm px-2">
              <div className="col-span-1">{index + 1}</div>
              <div className="col-span-5">{set.weight} kg</div>
              <div className="col-span-6">{set.reps}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

