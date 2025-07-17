"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppLayout } from "@/components/app-layout"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ActivityCard, Activity } from "@/components/activity-card"

export function HistoryPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()) // Initialize with current date
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Fetch user info (role)
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user/me")
        const data = await res.json()
        setIsAdmin(data.user?.role === "admin")
      } catch {
        setIsAdmin(false)
      }
    }
    fetchUser()
  }, [])

  // Fetch activities for the selected date
  useEffect(() => {
    if (!selectedDate) return
    async function fetchActivities() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/activities?date=${selectedDate ? selectedDate.toISOString() : ""}${isAdmin ? "&all=true" : ""}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to fetch activities")
        setActivities(data.activities || [])
      } catch (err: any) {
        setError(err.message || "Failed to fetch activities")
      } finally {
        setLoading(false)
      }
    }
    fetchActivities()
  }, [selectedDate, isAdmin])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const hasActivityOnDate = (date: Date) => {
    // For performance, you may want to cache this or fetch a summary endpoint
    return activities.some((activity) => isSameDay(new Date(activity.date), date))
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity History</h1>
        <p className="text-muted-foreground mt-1">View and manage your past activity logs</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {format(currentDate, "MMMM yyyy")}
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}> <ChevronLeft className="h-4 w-4" /> </Button>
                <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}> <ChevronRight className="h-4 w-4" /> </Button>
              </div>
            </div>
            <CardDescription>Click on a date to view activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map((day) => (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "p-2 text-sm rounded-md transition-colors hover:bg-muted",
                    isToday(day) && "bg-primary text-primary-foreground hover:bg-primary/90",
                    selectedDate && isSameDay(day, selectedDate) && !isToday(day) && "bg-muted",
                    hasActivityOnDate(day) && !isToday(day) && "bg-blue-50 text-blue-700 hover:bg-blue-100",
                  )}
                >
                  {format(day, "d")}
                  {hasActivityOnDate(day) && <div className="w-1 h-1 bg-current rounded-full mx-auto mt-1" />}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate
                ? `Activities for ${format(selectedDate, "MMMM d, yyyy")}`
                : "Select a date to view activities"}
            </CardTitle>
            <CardDescription>
              {selectedDate && activities.length > 0
                ? `${activities.length} ${activities.length === 1 ? "entry" : "entries"} found`
                : selectedDate
                  ? "No activities found for this date"
                  : "Click on a calendar date to see your logged activities"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Loading activities...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{error}</p>
              </div>
            ) : selectedDate && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} isAdmin={isAdmin} />
                ))}
              </div>
            ) : selectedDate ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No activities logged for this date</p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a date from the calendar to view your activities</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
