"use client"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"

import { Activity } from "@/types"

interface ActivityCardProps {
  activity: Activity
  showActions?: boolean
  onEdit?: (activity: Activity) => void
  onDelete?: (activityId: string) => void
  isAdmin?: boolean
}

export function ActivityCard({
  activity,
  showActions = false,
  onEdit,
  onDelete,
  isAdmin = false,
}: ActivityCardProps) {
  return (
    <Card className="border rounded-lg">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{activity.meetingType}</Badge>
            <span className="text-sm text-muted-foreground">
              {format(new Date(activity.date), "MMM d, yyyy")}
            </span>
            {isAdmin && activity.userName && (
              <Badge variant="outline" className="text-xs">
                {activity.userName}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {format(new Date(activity.timestamp), "h:mm a")}
            </span>
            {showActions && (
              <div className="flex gap-1">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(activity)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(activity.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        <p className="text-sm leading-relaxed">{activity.summary}</p>
        {activity.tickets && activity.tickets.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Tickets:</span>
            <div className="flex gap-1">
              {activity.tickets.map((ticket) => (
                <Badge key={ticket} variant="outline" className="text-xs">
                  #{ticket}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 