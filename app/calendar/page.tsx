import { CalendarView } from "@/components/calendar-view";
import MainNavWrapper from "@/components/main-nav-wrapper";

export default function CalendarPage() {
  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <CalendarView />
      <MainNavWrapper />
    </main>
  );
}

