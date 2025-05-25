import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change?: string;
  changeColor?: string;
  color?: string;
  loading?: boolean;
}

export function StatCard({
  icon,
  title,
  value,
  change,
  changeColor = "text-emerald-500",
  color = "text-emerald-500",
  loading = false,
}: StatCardProps) {
  return (
    <div className="bg-zinc-900 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-gray-400">{title}</span>
      </div>
      {loading ? (
        <Skeleton className="h-8 w-24 mb-1" />
      ) : (
        <p className="text-2xl font-bold">{value}</p>
      )}
      {loading ? (
        <Skeleton className="h-4 w-32" />
      ) : change ? (
        <p className={`text-xs ${changeColor} mt-1`}>{change}</p>
      ) : null}
    </div>
  );
}

