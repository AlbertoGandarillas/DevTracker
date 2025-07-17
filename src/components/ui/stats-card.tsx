import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  className?: string
  accentColor?: string
}

export function StatsCard({ title, value, description, icon: Icon, className, accentColor = "text-muted-foreground" }: StatsCardProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${accentColor}`} />
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            <span className="text-sm font-medium text-gray-600">{title}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  )
} 