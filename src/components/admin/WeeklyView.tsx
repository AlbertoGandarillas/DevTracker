"use client"

import { useMemo } from "react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityCard } from "@/components/activity-card"
import { parseActivityDate } from "@/lib/utils"
import { AdminActivity } from "@/types"

interface WeeklyViewProps {
  activities: AdminActivity[]
  loading?: boolean
}

export function WeeklyView({ activities, loading = false }: WeeklyViewProps) {
  // Get current week (Monday to Friday)
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }) // Sunday
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd }).slice(0, 5) // Monday to Friday only

  // Group activities by day and sort by user and datetime
  const activitiesByDay = useMemo(() => {
    const grouped: Record<string, AdminActivity[]> = {}
    
    // Initialize empty arrays for each day
    weekDays.forEach(day => {
      const dayKey = format(day, 'yyyy-MM-dd')
      grouped[dayKey] = []
    })

    // Group activities by day
    activities.forEach(activity => {
      const activityDate = parseActivityDate(activity.date)
      const dayKey = format(activityDate, 'yyyy-MM-dd')
      
      if (grouped[dayKey]) {
        grouped[dayKey].push(activity)
      }
    })

    // Sort activities within each day by user name and then by datetime (desc)
    Object.keys(grouped).forEach(dayKey => {
      grouped[dayKey].sort((a, b) => {
        // First sort by user name
        const userComparison = a.developer.localeCompare(b.developer)
        if (userComparison !== 0) return userComparison
        
        // Then sort by datetime (desc)
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      })
    })

    return grouped
  }, [activities, weekDays])

  const getDayHeader = (date: Date) => {
    const isToday = isSameDay(date, now)
    return (
      <div className={`text-center p-3 ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'} border-b`}>
        <div className="font-semibold text-gray-900">
          {format(date, 'EEE')}
        </div>
        <div className={`text-sm ${isToday ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
          {format(date, 'MMM d')}
        </div>
        {isToday && (
          <div className="text-xs text-blue-500 font-medium mt-1">Today</div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading weekly activities...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Weekly View
          <span className="text-sm font-normal text-gray-500">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4">
          {weekDays.map((day) => {
            const dayKey = format(day, 'yyyy-MM-dd')
            const dayActivities = activitiesByDay[dayKey] || []
            
            return (
              <div key={dayKey} className="min-h-[600px] border rounded-lg overflow-hidden">
                {getDayHeader(day)}
                <div className="p-3 space-y-3 max-h-[550px] overflow-y-auto">
                  {dayActivities.length > 0 ? (
                    dayActivities.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={{
                          id: activity.id,
                          date: activity.date,
                          meetingType: activity.meetingType,
                          summary: activity.summary,
                          timestamp: activity.submittedAt,
                          userName: activity.developer,
                        }}
                        isAdmin={true}
                        compact={true}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No activities
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 