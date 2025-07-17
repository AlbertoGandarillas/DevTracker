"use client"

import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfWeek, endOfWeek } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarViewProps {
  currentDate: Date
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  onMonthChange: (direction: "prev" | "next") => void
  hasActivityOnDate: (date: Date) => boolean
}

export function CalendarView({
  currentDate,
  selectedDate,
  onDateSelect,
  onMonthChange,
  hasActivityOnDate
}: CalendarViewProps) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  
  // Get the calendar view (including days from previous/next month to fill the grid)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }) // Start from Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 }) // End on Saturday
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {format(currentDate, "MMMM yyyy")}
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={() => onMonthChange("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => onMonthChange("next")}>
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
          {calendarDays.map((day) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth()
            const isCurrentYear = day.getFullYear() === currentDate.getFullYear()
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => onDateSelect(day)}
                className={cn(
                  "p-2 text-sm rounded-md transition-colors hover:bg-muted",
                  !isCurrentMonth && "text-muted-foreground/50",
                  selectedDate && isSameDay(day, selectedDate) && "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600",
                  isToday(day) && !selectedDate && "bg-primary text-primary-foreground hover:bg-primary/90",
                  hasActivityOnDate(day) && !selectedDate && !isToday(day) && isCurrentMonth && "bg-blue-50 text-blue-700 hover:bg-blue-100",
                )}
              >
                {format(day, "d")}
                {hasActivityOnDate(day) && isCurrentMonth && <div className="w-1 h-1 bg-current rounded-full mx-auto mt-1" />}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 