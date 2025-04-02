// A library of common exercises to choose from

interface ExerciseTemplate {
  name: string;
  muscleGroup: string;
}

const exerciseLibrary: ExerciseTemplate[] = [
  // Chest
  { name: "Bench Press", muscleGroup: "Chest" },
  { name: "Incline Bench Press", muscleGroup: "Upper Chest" },
  { name: "Decline Bench Press", muscleGroup: "Lower Chest" },
  { name: "Dumbbell Fly", muscleGroup: "Chest" },
  { name: "Push-Up", muscleGroup: "Chest" },
  { name: "Cable Crossover", muscleGroup: "Chest" },
  { name: "Chest Dip", muscleGroup: "Lower Chest" },

  // Back
  { name: "Pull-Up", muscleGroup: "Back" },
  { name: "Lat Pulldown", muscleGroup: "Back" },
  { name: "Bent Over Row", muscleGroup: "Back" },
  { name: "T-Bar Row", muscleGroup: "Back" },
  { name: "Seated Cable Row", muscleGroup: "Back" },
  { name: "Deadlift", muscleGroup: "Back" },
  { name: "Back Extension", muscleGroup: "Lower Back" },

  // Legs
  { name: "Squat", muscleGroup: "Legs" },
  { name: "Leg Press", muscleGroup: "Legs" },
  { name: "Leg Extension", muscleGroup: "Quadriceps" },
  { name: "Leg Curl", muscleGroup: "Hamstrings" },
  { name: "Calf Raise", muscleGroup: "Calves" },
  { name: "Lunge", muscleGroup: "Legs" },
  { name: "Romanian Deadlift", muscleGroup: "Hamstrings" },

  // Glutes
  { name: "Pauliina's stepups", muscleGroup: "Glutes" },
  { name: "Glute Bridge", muscleGroup: "Glutes" },
  { name: "Hip Thrust", muscleGroup: "Glutes" },
  { name: "Sumo Deadlift", muscleGroup: "Glutes" },
  { name: "Romanian Deadlift", muscleGroup: "Glutes" },
  { name: "Glute Kickback", muscleGroup: "Glutes" },

  // Shoulders
  { name: "Overhead Press", muscleGroup: "Shoulders" },
  { name: "Lateral Raise", muscleGroup: "Shoulders" },
  { name: "Front Raise", muscleGroup: "Front Deltoids" },
  { name: "Reverse Fly", muscleGroup: "Rear Deltoids" },
  { name: "Face Pull", muscleGroup: "Rear Deltoids" },
  { name: "Shrug", muscleGroup: "Trapezius" },

  // Arms
  { name: "Bicep Curl", muscleGroup: "Biceps" },
  { name: "Hammer Curl", muscleGroup: "Biceps" },
  { name: "Tricep Extension", muscleGroup: "Triceps" },
  { name: "Tricep Pushdown", muscleGroup: "Triceps" },
  { name: "Skull Crusher", muscleGroup: "Triceps" },
  { name: "Preacher Curl", muscleGroup: "Biceps" },

  // Core
  { name: "Crunch", muscleGroup: "Abs" },
  { name: "Plank", muscleGroup: "Core" },
  { name: "Russian Twist", muscleGroup: "Obliques" },
  { name: "Leg Raise", muscleGroup: "Lower Abs" },
  { name: "Ab Rollout", muscleGroup: "Core" },
];

export const getExerciseLibrary = (): ExerciseTemplate[] => {
  return exerciseLibrary;
};

