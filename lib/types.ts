export interface Set {
  id: string;
  reps: number;
  weight: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  exercises: Exercise[];
  totalSets: number;
}

export interface ExerciseHistory {
  date: string;
  workoutId: string;
  workoutName: string;
  maxWeight: number;
  sets: Array<{
    reps: number;
    weight: number;
  }>;
}

