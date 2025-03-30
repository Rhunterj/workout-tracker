"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format } from "date-fns"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface HistoryItem {
  date: string
  workoutId: string
  workoutName: string
  maxWeight: number
  sets: Array<{
    reps: number
    weight: number
  }>
}

interface ExerciseProgressChartProps {
  history: HistoryItem[]
}

export default function ExerciseProgressChart({ history }: ExerciseProgressChartProps) {
  // Process data for the chart
  const chartData = history.map((item) => ({
    date: item.date,
    maxWeight: item.maxWeight,
    avgWeight: Math.round(item.sets.reduce((sum, set) => sum + set.weight, 0) / item.sets.length),
    // Calculate volume (weight × reps) for each set and sum them
    volume: item.sets.reduce((sum, set) => sum + set.weight * set.reps, 0),
  }))

  return (
    <ChartContainer
      config={{
        maxWeight: {
          label: "Max Weight (kg)",
          color: "hsl(var(--chart-1))",
        },
        avgWeight: {
          label: "Avg Weight (kg)",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-full"
    >
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => format(new Date(value), "MMM d")}
          tickMargin={10}
          tickLine={false}
          axisLine={false}
        />
        <YAxis tickFormatter={(value) => `${value}kg`} tickMargin={10} tickLine={false} axisLine={false} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="line"
              formatter={(value, name) => [`${value}kg`, name]}
              labelFormatter={(label) => format(new Date(label), "MMMM d, yyyy")}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="maxWeight"
          stroke="var(--color-maxWeight)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="avgWeight"
          stroke="var(--color-avgWeight)"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  )
}

