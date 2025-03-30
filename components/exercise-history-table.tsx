import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

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

interface ExerciseHistoryTableProps {
  history: HistoryItem[]
}

export default function ExerciseHistoryTable({ history }: ExerciseHistoryTableProps) {
  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <Link key={index} href={`/workout/${item.workoutId}`}>
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{item.workoutName}</CardTitle>
              <p className="text-sm text-muted-foreground">{format(new Date(item.date), "MMMM d, yyyy")}</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="grid grid-cols-12 gap-2 text-sm text-muted-foreground px-2">
                  <div className="col-span-1">#</div>
                  <div className="col-span-5">Weight</div>
                  <div className="col-span-6">Reps</div>
                </div>

                {item.sets.map((set, setIndex) => (
                  <div key={setIndex} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-1 text-sm font-medium">{setIndex + 1}</div>
                    <div className="col-span-5 text-sm">{set.weight} kg</div>
                    <div className="col-span-6 text-sm">{set.reps} reps</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

