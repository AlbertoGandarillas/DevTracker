import { Activity, Users, Calendar } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { Stats } from "@/types";

interface AdminHeaderProps {
  stats: Stats;
  loading?: boolean;
}

export function AdminHeader({ stats, loading = false }: AdminHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-indigo-900">
            Team Overview
          </h1>
          <p className="text-indigo-700 mt-1 font-medium">
            Monitor and manage team activity across all developers
          </p>
        </div>
        
        {/* Stats Cards - Hidden on mobile, shown on large screens */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4">
          <StatsCard
            title="Total Activities"
            value={loading ? 0 : stats.totalActivities}
            icon={Activity}
            description="All time activities"
            accentColor="text-purple-600"
          />
          <StatsCard
            title="Active Developers"
            value={loading ? 0 : stats.activeDevelopers}
            icon={Users}
            description="Currently active"
            accentColor="text-blue-600"
          />
          <StatsCard
            title="This Week"
            value={loading ? 0 : stats.thisWeek}
            icon={Calendar}
            description="Activities this week"
            accentColor="text-green-600"
          />
        </div>
      </div>
    </div>
  );
} 