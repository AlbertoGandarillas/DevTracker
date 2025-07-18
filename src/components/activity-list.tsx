"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { ActivityCard } from "@/components/activity-card"
import { Clock, CalendarIcon } from "lucide-react"
import { Activity } from "@/types"

interface ActivityListProps {
  activities: Activity[]
  loading: boolean
  error: string | null
  title: string
  description?: string
  emptyMessage?: string
  isAdmin?: boolean
}

export function ActivityList({
  activities,
  loading,
  error,
  title,
  description,
  emptyMessage = "No activities found",
  isAdmin = false
}: ActivityListProps) {
  if (loading) {
    return (
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Clock className="h-3 w-3 text-white" />
            </div>
            {title}
          </CardTitle>
          {description && <CardDescription className="text-gray-600">{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <LoadingSpinner text="Loading activities..." />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Clock className="h-3 w-3 text-white" />
            </div>
            {title}
          </CardTitle>
          {description && <CardDescription className="text-gray-600">{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <ErrorMessage message={error} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <Clock className="h-3 w-3 text-white" />
          </div>
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600">
          Your activity logs from the past 7 days
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} isAdmin={isAdmin} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{emptyMessage}</p>
          </div>
        )}
        
      </CardContent>
    </Card>
  )
} 