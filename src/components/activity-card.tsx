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
    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs font-medium">
            {activity.meetingType}
          </Badge>
          <span className="text-sm text-gray-600 font-medium">
            {format(new Date(activity.date), "MMM d")}
          </span>
          {isAdmin && activity.userName && (
            <Badge variant="outline" className="text-xs">
              {activity.userName}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">
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
      <p className="text-sm text-gray-900 leading-relaxed">{activity.summary}</p>
      {activity.tickets && activity.tickets.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">TICKETS:</span>
          <div className="flex gap-1">
            {activity.tickets.map((ticket) => (
              <Badge key={ticket} className="bg-gray-200 text-gray-700 border-gray-300 text-xs">
                {ticket}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 