"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { StatCard } from "@/components/progress/stat-card";
import { StrengthProgress } from "@/components/progress/strength-progress";
import { Dumbbell, TrendingUp, Calendar, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProgressData {
  volume: {
    current: number;
    previous: number;
    change: number;
  };
  maxWeight: {
    current: number;
    previous: number;
    change: number;
  };
  workouts: {
    current: number;
    previous: number;
    change: number;
  };
  consistency: {
    current: number;
    previous: number;
    change: number;
  };
  strengthProgress: Array<{
    name: string;
    currentMax: number;
    previousMax: number;
    change: number;
  }>;
}

export function ProgressView() {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">(
    "month"
  );
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/progress");
        if (!response.ok) {
          throw new Error("Failed to fetch progress data");
        }
        const data = await response.json();
        setProgressData(data);
      } catch (error) {
        console.error("Error fetching progress data:", error);
        toast({
          title: "Error",
          description: "Failed to load progress data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [toast]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Progress Overview</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeframe("week")}
            className={`px-3 py-1 rounded-md text-sm ${
              timeframe === "week"
                ? "bg-zinc-800 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe("month")}
            className={`px-3 py-1 rounded-md text-sm ${
              timeframe === "month"
                ? "bg-zinc-800 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeframe("year")}
            className={`px-3 py-1 rounded-md text-sm ${
              timeframe === "year"
                ? "bg-zinc-800 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Volume"
          value={
            progressData?.volume.current
              ? formatNumber(progressData.volume.current)
              : "0"
          }
          change={
            progressData?.volume.change
              ? formatChange(
                  progressData.volume.current,
                  progressData.volume.previous,
                  " kg"
                )
              : undefined
          }
          changeColor={
            progressData?.volume.change && progressData.volume.change > 0
              ? "text-emerald-500"
              : "text-red-500"
          }
          icon={<Dumbbell className="h-5 w-5" />}
          loading={loading}
        />
        <StatCard
          title="Max Weight"
          value={
            progressData?.maxWeight.current
              ? `${progressData.maxWeight.current} kg`
              : "0 kg"
          }
          change={
            progressData?.maxWeight.change
              ? formatChange(
                  progressData.maxWeight.current,
                  progressData.maxWeight.previous,
                  " kg"
                )
              : undefined
          }
          changeColor={
            progressData?.maxWeight.change && progressData.maxWeight.change > 0
              ? "text-emerald-500"
              : "text-red-500"
          }
          icon={<TrendingUp className="h-5 w-5" />}
          loading={loading}
        />
        <StatCard
          title="Workouts"
          value={
            progressData?.workouts.current
              ? progressData.workouts.current.toString()
              : "0"
          }
          change={
            progressData?.workouts.change
              ? formatChange(
                  progressData.workouts.current,
                  progressData.workouts.previous
                )
              : undefined
          }
          changeColor={
            progressData?.workouts.change && progressData.workouts.change > 0
              ? "text-emerald-500"
              : "text-red-500"
          }
          icon={<Calendar className="h-5 w-5" />}
          loading={loading}
        />
        <StatCard
          title="Consistency"
          value={
            progressData?.consistency.current
              ? formatPercentage(progressData.consistency.current)
              : "0%"
          }
          change={
            progressData?.consistency.change
              ? formatChange(
                  progressData.consistency.current,
                  progressData.consistency.previous,
                  "%"
                )
              : undefined
          }
          changeColor={
            progressData?.consistency.change &&
            progressData.consistency.change > 0
              ? "text-emerald-500"
              : "text-red-500"
          }
          icon={<Target className="h-5 w-5" />}
          loading={loading}
        />
      </div>

      <Tabs defaultValue="strength" className="space-y-4">
        <TabsList className="grid grid-cols-3 bg-zinc-900">
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="frequency">Frequency</TabsTrigger>
        </TabsList>

        <TabsContent value="strength">
          <StrengthProgress
            exercises={progressData?.strengthProgress || []}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="volume">
          <div className="bg-zinc-900 rounded-lg p-4 h-64 flex items-center justify-center">
            <p className="text-gray-400">Volume chart will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="frequency">
          <div className="bg-zinc-900 rounded-lg p-4 h-64 flex items-center justify-center">
            <p className="text-gray-400">Frequency chart will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

