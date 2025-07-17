"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarView } from "@/components/calendar-view"
import { ActivityList } from "@/components/activity-list"
import { useActivities } from "@/hooks/useActivities"
import { useUser } from "@/hooks/useUser"
import { isSameDay } from "date-fns"
import { parseActivityDate } from "@/lib/utils"

export function HistoryPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const { user, isAdmin } = useUser()
  
  const { activities, loading, error } = useActivities({
    date: selectedDate ? selectedDate.toISOString() : undefined,
    all: isAdmin
  })

  const hasActivityOnDate = (date: Date) => {
    return activities.some((activity) => isSameDay(parseActivityDate(activity.date), date))
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getActivityListTitle = () => {
    if (!selectedDate) return "Select a date to view activities"
    return `Activities for ${format(selectedDate, "MMMM d, yyyy")}`
  }

  const getActivityListDescription = () => {
    if (!selectedDate) return "Click on a calendar date to see your logged activities"
    if (activities.length > 0) {
      return `${activities.length} ${activities.length === 1 ? "entry" : "entries"} found`
    }
    return "No activities found for this date"
  }

  return (
    <div className="space-y-6">
      {/* Activity History Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-indigo-900">
              Activity History
            </h1>
            <p className="text-indigo-700 mt-1 font-medium">View and manage your past activity logs</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendar */}
        <CalendarView
          currentDate={currentDate}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onMonthChange={navigateMonth}
          hasActivityOnDate={hasActivityOnDate}
        />

        {/* Activity Details */}
        <ActivityList
          activities={activities}
          loading={loading}
          error={error}
          title={getActivityListTitle()}
          description={getActivityListDescription()}
          emptyMessage={selectedDate ? "No activities logged for this date" : "Select a date from the calendar to view your activities"}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  )
}
