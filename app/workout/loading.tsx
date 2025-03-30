export default function Loading() {
  return (
    <main className="container max-w-md mx-auto p-4">
      <div className="animate-pulse">
        <div className="h-8 w-1/2 bg-muted rounded mb-6"></div>
        <div className="h-40 bg-muted rounded mb-6"></div>
        <div className="h-6 w-1/4 bg-muted rounded mb-4"></div>
        <div className="h-32 bg-muted rounded"></div>
      </div>
    </main>
  )
}

