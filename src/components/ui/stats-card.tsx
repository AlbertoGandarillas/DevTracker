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
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor.replace('text-', 'bg-')}`}></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pl-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${accentColor}`} />
      </CardHeader>
      <CardContent className="pl-4">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
} 