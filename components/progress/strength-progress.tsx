import { Skeleton } from "@/components/ui/skeleton";

interface Exercise {
  name: string;
  currentMax: number;
  previousMax: number;
  change: number;
}

interface StrengthProgressProps {
  exercises: Exercise[];
  loading: boolean;
}

export function StrengthProgress({
  exercises,
  loading,
}: StrengthProgressProps) {
  const formatWeight = (num: number) => {
    return `${num} kg`;
  };

  const formatChange = (
    current: number,
    previous: number,
    unit: string = ""
  ) => {
    const change = current - previous;
    const formattedChange = change > 0 ? `+${change}` : change;
    return `${formattedChange}${unit} from last month`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-zinc-900 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!exercises.length) {
    return (
      <div className="bg-zinc-900 rounded-lg p-4 h-32 flex items-center justify-center">
        <p className="text-gray-400">No strength data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise) => {
        const progressPercentage =
          exercise.previousMax > 0
            ? ((exercise.currentMax - exercise.previousMax) /
                exercise.previousMax) *
              100
            : 100;

        return (
          <div key={exercise.name} className="bg-zinc-900 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">{exercise.name}</h3>
              <span
                className={`text-sm ${
                  exercise.change > 0 ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {formatChange(exercise.currentMax, exercise.previousMax, " kg")}
              </span>
            </div>
            <div className="h-12 bg-zinc-800 rounded-lg relative overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${
                  exercise.change > 0
                    ? "from-emerald-900 to-emerald-600"
                    : "from-red-900 to-red-600"
                } rounded-lg`}
                style={{
                  width: `${Math.min(100, Math.max(0, progressPercentage))}%`,
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-between px-3">
                <span className="text-xs font-medium">
                  {formatWeight(exercise.previousMax)}
                </span>
                <span className="text-xs font-medium">
                  {formatWeight(exercise.currentMax)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

