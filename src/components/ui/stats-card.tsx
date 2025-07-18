import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  description: string
  accentColor?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  accentColor = "text-blue-600"
}: StatsCardProps) {
  return (
    <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className={`p-2 rounded-lg bg-gray-50 ${accentColor}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
} 