"use client"

import { useState } from "react"
import { format, startOfWeek } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { AppLayout } from "@/components/app-layout"
import { Clock, Calendar, User } from "lucide-react"
import { useUser } from "@clerk/nextjs"

// Mock data for recent submissions
const mockRecentSubmissions = [
  {
    id: 1,
    date: "2024-01-15",
    meetingType: "Dev Meeting",
    summary:
      "Fixed issue with spCheckVariableUnitExhibit, courses with variable units now able to be created dynamically",
    timestamp: "2:30 PM",
  },
  {
    id: 2,
    date: "2024-01-14",
    meetingType: "EOD Update",
    summary: "Working on card 1834 changes. Lisa already sent the script. After finishing 1834 I will jump to 1840",
    timestamp: "5:45 PM",
  },
  {
    id: 3,
    date: "2024-01-13",
    meetingType: "12pm Updates",
    summary: "Updated front-end according Alex Mockup - Pending Pedro C. confirmation of DB changes",
    timestamp: "12:15 PM",
  },
]

const meetingTypes = ["Dev Meeting", "EOD Update", "12pm Updates", "Stand-up", "Code Review", "Planning"]

export function DashboardPage() {
  const [updateText, setUpdateText] = useState("")
  const [meetingType, setMeetingType] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ meetingType?: string; activityDetails?: string }>({})
  const { user } = useUser()

  const handleSubmit = async () => {
    // Clear previous errors
    setErrors({})

    // Client-side validation
    const newErrors: { meetingType?: string; activityDetails?: string } = {}

    if (!meetingType.trim()) {
      newErrors.meetingType = "Meeting type is required"
      toast.error("Please select a meeting type", {
        description: "Meeting type is required to submit your update."
      })
    }

    if (!updateText.trim()) {
      newErrors.activityDetails = "Activity details are required"
      toast.error("Please enter activity details", {
        description: "Activity details are required to submit your update."
      })
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetingType: meetingType.trim(),
          activityDetails: updateText.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit activity')
      }

      toast.success("Update submitted successfully", {
        description: "Your daily activity has been logged.",
      })

      setUpdateText("")
      setMeetingType("")
      setErrors({})
    } catch (error) {
      console.error('Error submitting activity:', error)
      toast.error("Failed to submit update", {
        description: error instanceof Error ? error.message : "Please try again later."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const today = format(new Date(), "EEEE, MMMM do, yyyy")
  const currentWeek = format(startOfWeek(new Date()), "MMMM do")

  return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName || user?.username}</h1>
            <p className="text-muted-foreground mt-1">{today}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Week of {currentWeek}</span>
          </div>
        </div>

        {/* Quick Activity Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Today&apos;s Update
            </CardTitle>
            <CardDescription>Log your progress, tickets worked on, issues, or expected completions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Meeting Type (Mandatory)</label>
              <Select 
                value={meetingType} 
                onValueChange={(value) => {
                  setMeetingType(value)
                  if (errors.meetingType) {
                    setErrors(prev => ({ ...prev, meetingType: undefined }))
                  }
                }}
              >
                <SelectTrigger className={errors.meetingType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select meeting type..." />
                </SelectTrigger>
                <SelectContent>
                  {meetingTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.meetingType && (
                <p className="text-sm text-red-500">{errors.meetingType}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Activity Details</label>
              <Textarea
                placeholder="Enter today's progress, tickets worked on, issues, or expected completions..."
                value={updateText}
                onChange={(e) => {
                  setUpdateText(e.target.value)
                  if (errors.activityDetails) {
                    setErrors(prev => ({ ...prev, activityDetails: undefined }))
                  }
                }}
                className={`min-h-[120px] resize-none ${errors.activityDetails ? "border-red-500" : ""}`}
              />
              {errors.activityDetails && (
                <p className="text-sm text-red-500">{errors.activityDetails}</p>
              )}
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={!updateText.trim() || !meetingType.trim() || isSubmitting} 
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Submitting..." : "Submit Update"}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Submissions
            </CardTitle>
            <CardDescription>Your activity logs from the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentSubmissions.map((submission) => (
                <div key={submission.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{submission.meetingType}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(submission.date), "MMM d, yyyy")}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{submission.timestamp}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{submission.summary}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
