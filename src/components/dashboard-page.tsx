"use client"

import { useState } from "react"
import { format, startOfWeek } from "date-fns"
import { toast } from "sonner"
import { Calendar } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { ActivityForm } from "@/components/activity-form"
import { ActivityList } from "@/components/activity-list"
import { useActivities } from "@/hooks/useActivities"
import { ActivityFormData } from "@/types"

export function DashboardPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useUser()
  const { activities, loading: loadingActivities, error: activitiesError, refetch } = useActivities({ days: 7, limit: 10 })

  const handleSubmit = async (formData: ActivityFormData) => {
    setIsSubmitting(true)

    try {
      // Get current date and time in user's local timezone
      const now = new Date()
      const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const localTimestamp = now.toISOString()
      
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetingType: formData.meetingType.trim(),
          activityDetails: formData.activityDetails.trim(),
          date: localDate.toISOString(), // Send local date to server
          createdAt: localTimestamp, // Send local timestamp to server
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit activity')
      }

      toast.success("Update submitted successfully", {
        description: "Your daily activity has been logged.",
      })

      await refetch() // Refresh activities after submit
    } catch (error) {
      console.error('Error submitting activity:', error)
      toast.error("Failed to submit update", {
        description: error instanceof Error ? error.message : "Please try again later."
      })
      throw error // Re-throw to let the form handle the error state
    } finally {
      setIsSubmitting(false)
    }
  }

  const today = format(new Date(), "EEEE, MMMM do, yyyy")
  const currentWeek = format(startOfWeek(new Date()), "MMMM do")

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-indigo-900">
              Welcome back, {user?.firstName || user?.username}
            </h1>
            <p className="text-indigo-700 mt-1 font-medium">{today}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-indigo-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Week of {currentWeek}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity Form */}
        <ActivityForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

        {/* Recent Submissions */}
        <ActivityList
          activities={activities}
          loading={loadingActivities}
          error={activitiesError}
          title="Recent Submissions"
          emptyMessage="No recent submissions found"
          onRefresh={refetch}
        />
      </div>
    </div>
  )
}
