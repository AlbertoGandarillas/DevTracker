"use client"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, User, Clock, Calendar } from "lucide-react"
import { parseActivityDate } from "@/lib/utils"

import { Activity } from "@/types"

interface ActivityCardProps {
  activity: Activity
  showActions?: boolean
  onEdit?: (activity: Activity) => void
  onDelete?: (activityId: string) => void
  isAdmin?: boolean
  compact?: boolean
}

export function ActivityCard({
  activity,
  showActions = false,
  onEdit,
  onDelete,
  isAdmin = false,
  compact = false,
}: ActivityCardProps) {
  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-3 hover:shadow-sm transition-shadow">
        {/* Meeting Type Badge */}
        <div className="flex items-center justify-between">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs font-medium">
            {activity.meetingType}
          </Badge>
          {showActions && (
            <div className="flex gap-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onEdit(activity)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:text-destructive"
                  onClick={() => onDelete(activity.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* User Info */}
        {isAdmin && activity.userName && (
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-gray-400" />
            <span className="text-xs font-medium text-gray-700">
              {activity.userName}
            </span>
          </div>
        )}

        {/* Time */}
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-600">
            {format(new Date(activity.timestamp), "h:mm a")}
          </span>
        </div>

        {/* Summary */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-sm text-gray-900 leading-relaxed line-clamp-3">
            {activity.summary}
          </p>
        </div>

        {/* Tickets */}
        {activity.tickets && activity.tickets.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {activity.tickets.map((ticket) => (
              <Badge key={ticket} className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
                {ticket}
              </Badge>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Original layout (default)
  return (
    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs font-medium">
            {activity.meetingType}
          </Badge>
          <span className="text-sm text-gray-600 font-medium">
            {format(parseActivityDate(activity.date), "MMM d")}
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