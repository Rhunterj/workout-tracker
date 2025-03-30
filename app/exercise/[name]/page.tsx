"use client"

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { getExerciseHistory } from "@/lib/workout-service"
import ExerciseProgressChart from "@/components/exercise-progress-chart"
import ExerciseHistoryTable from "@/components/exercise-history-table"
import MainNav from "@/components/main-nav"

export default function ExerciseProgressPage(props: { params: Promise<{ name: string }> }) {
  const params = use(props.params);
  const router = useRouter()
  const { toast } = useToast()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const exerciseName = decodeURIComponent(params.name)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getExerciseHistory(exerciseName)
        setHistory(data)
      } catch (error) {
        toast({
          title: "Error loading exercise history",
          description: "Please try again later",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [exerciseName, toast])

  if (loading) {
    return (
      <main className="container max-w-md mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 w-1/2 bg-muted rounded mb-6"></div>
          <div className="h-6 w-1/3 bg-muted rounded mb-4"></div>
          <div className="h-64 bg-muted rounded mb-6"></div>
          <div className="h-6 w-1/4 bg-muted rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{exerciseName}</h1>
          <p className="text-muted-foreground">Progress Tracking</p>
        </div>
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-40">
            <TrendingUp className="h-10 w-10 mb-4 text-muted-foreground" />
            <h3 className="font-medium text-lg">No history yet</h3>
            <p className="text-muted-foreground">Complete more workouts with this exercise to see your progress</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs defaultValue="chart" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Weight Progression</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ExerciseProgressChart history={history} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <ExerciseHistoryTable history={history} />
            </TabsContent>
          </Tabs>
        </>
      )}

      <MainNav />
    </main>
  )
}

