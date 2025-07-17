"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"
import { Activity } from "@/types"
import { ActivityCard } from "./activity-card"
import { LoadingSpinner } from "./ui/loading-spinner"
import { ErrorMessage } from "./ui/error-message"

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
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <LoadingSpinner text="Loading activities..." />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <ErrorMessage message={error} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {activities.length > 0
            ? `${activities.length} ${activities.length === 1 ? "entry" : "entries"} found`
            : description || emptyMessage}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} isAdmin={isAdmin} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{emptyMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 