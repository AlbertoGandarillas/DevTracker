"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { User } from "lucide-react"
import { ActivityFormData, ValidationErrors } from "@/types"

const meetingTypes = ["Dev Meeting", "EOD Update", "12pm Updates", "Stand-up", "Code Review", "Planning"]

interface ActivityFormProps {
  onSubmit: (data: ActivityFormData) => Promise<void>
  isSubmitting?: boolean
}

export function ActivityForm({ onSubmit, isSubmitting = false }: ActivityFormProps) {
  const [formData, setFormData] = useState<ActivityFormData>({
    meetingType: "",
    activityDetails: ""
  })
  const [errors, setErrors] = useState<ValidationErrors>({})

  const handleSubmit = async () => {
    // Clear previous errors
    setErrors({})

    // Client-side validation
    const newErrors: ValidationErrors = {}

    if (!formData.meetingType.trim()) {
      newErrors.meetingType = "Meeting type is required"
      toast.error("Please select a meeting type", {
        description: "Meeting type is required to submit your update."
      })
    }

    if (!formData.activityDetails.trim()) {
      newErrors.activityDetails = "Activity details are required"
      toast.error("Please enter activity details", {
        description: "Activity details are required to submit your update."
      })
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await onSubmit(formData)
      // Reset form on success
      setFormData({ meetingType: "", activityDetails: "" })
      setErrors({})
    } catch (error) {
      // Error handling is done in the parent component
    }
  }

  const updateField = (field: keyof ActivityFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
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
            value={formData.meetingType} 
            onValueChange={(value) => updateField('meetingType', value)}
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
            value={formData.activityDetails}
            onChange={(e) => updateField('activityDetails', e.target.value)}
            className={`min-h-[120px] resize-none ${errors.activityDetails ? "border-red-500" : ""}`}
          />
          {errors.activityDetails && (
            <p className="text-sm text-red-500">{errors.activityDetails}</p>
          )}
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={!formData.activityDetails.trim() || !formData.meetingType.trim() || isSubmitting} 
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Submitting..." : "Submit Update"}
        </Button>
      </CardContent>
    </Card>
  )
} 