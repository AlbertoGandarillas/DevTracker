"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AppLayout } from "@/components/app-layout"
import { ChevronLeft, ChevronRight, CalendarIcon, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock activity data
const mockActivities = [
  {
    id: 1,
    date: "2024-01-15",
    meetingType: "Dev Meeting",
    summary:
      "Fixed issue with spCheckVariableUnitExhibit, courses with variable units now able to be created dynamically from the Exhibit page. Semester Units, UG, Pending PR release alongside any script and DB changes.",
    tickets: ["1376", "1840"],
    timestamp: "2:30 PM",
  },
  {
    id: 2,
    date: "2024-01-15",
    meetingType: "EOD Update",
    summary:
      "Completed testing and debugging. Finished work on testing the Exhibit management. Expecting to have to debug some existing features.",
    tickets: ["1376"],
    timestamp: "5:45 PM",
  },
  {
    id: 3,
    date: "2024-01-14",
    meetingType: "12pm Updates",
    summary:
      "Updated front-end according Alex Mockup - Pending Pedro C. confirmation of DB changes for GetPotentialCPLSavings",
    tickets: ["1840"],
    timestamp: "12:15 PM",
  },
]

export function HistoryPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getActivitiesForDate = (date: Date) => {
    return mockActivities.filter((activity) => isSameDay(new Date(activity.date), date))
  }

  const hasActivityOnDate = (date: Date) => {
    return getActivitiesForDate(date).length > 0
  }

  const selectedDateActivities = selectedDate ? getActivitiesForDate(selectedDate) : []

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
    <AppLayout>
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
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>Click on a date to view activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
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
                {selectedDate && selectedDateActivities.length > 0
                  ? `${selectedDateActivities.length} ${selectedDateActivities.length === 1 ? "entry" : "entries"} found`
                  : selectedDate
                    ? "No activities found for this date"
                    : "Click on a calendar date to see your logged activities"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDate && selectedDateActivities.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateActivities.map((activity) => (
                    <div key={activity.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{activity.meetingType}</Badge>
                          <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed">{activity.summary}</p>

                      {activity.tickets.length > 0 && (
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
                    </div>
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
    </AppLayout>
  )
}
