"use client"
import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Edit, Trash2, User, Clock } from "lucide-react"
import { parseActivityDate } from "@/lib/utils"
import { toast } from "sonner"
import { ActivityForm } from "@/components/activity-form"
import { ActivityFormData } from "@/types"

import { Activity } from "@/types"

interface ActivityCardProps {
  activity: Activity
  showActions?: boolean
  onEdit?: (activity: Activity) => void
  onDelete?: (activityId: string) => void
  isAdmin?: boolean
  compact?: boolean
}

export function ActivityCard({
  activity,
  showActions = false,
  onEdit,
  onDelete,
  isAdmin = false,
  compact = false,
}: ActivityCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleDelete = async () => {
    if (!onDelete) return
    
    setIsDeleting(true)
    try {
      await onDelete(activity.id)
      setIsDeleteDialogOpen(false)
      toast.success("Activity deleted successfully", {
        description: "The activity has been removed from your records."
      })
    } catch (error) {
      toast.error("Failed to delete activity", {
        description: error instanceof Error ? error.message : "Please try again later."
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = async (formData: ActivityFormData) => {
    if (!onEdit) return
    
    setIsEditing(true)
    try {
      // Create updated activity object
      const updatedActivity: Activity = {
        ...activity,
        meetingType: formData.meetingType,
        summary: formData.activityDetails,
      }
      
      await onEdit(updatedActivity)
      setIsEditDialogOpen(false)
      toast.success("Activity updated successfully", {
        description: "Your activity has been updated."
      })
    } catch (error) {
      toast.error("Failed to update activity", {
        description: error instanceof Error ? error.message : "Please try again later."
      })
    } finally {
      setIsEditing(false)
    }
  }

  const initialFormData: ActivityFormData = {
    meetingType: activity.meetingType,
    activityDetails: activity.summary,
  }

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-3 hover:shadow-sm transition-shadow group">
        {/* Meeting Type Badge and Actions */}
        <div className="flex items-center justify-between">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs font-medium">
            {activity.meetingType}
          </Badge>
          {showActions && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Edit Activity</DialogTitle>
                    <DialogDescription>
                      Update the meeting type and activity details for this entry.
                    </DialogDescription>
                  </DialogHeader>
                  <ActivityForm 
                    onSubmit={handleEdit} 
                    isSubmitting={isEditing}
                    initialData={initialFormData}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Activity</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this activity? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {/* User Info */}
        {activity.userName && (
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-gray-400" />
            <span className="text-xs font-medium text-gray-700">
              {activity.userName}
            </span>
          </div>
        )}

        {/* Time */}
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-600">
            {format(new Date(activity.timestamp), "h:mm a")}
          </span>
        </div>

        {/* Summary */}
        <div className="pt-2 border-t border-gray-100">
          <div 
            className="text-sm text-gray-900 leading-relaxed line-clamp-3 activity-content"
            dangerouslySetInnerHTML={{ __html: activity.summary }}
          />
        </div>

        {/* Tickets */}
        {activity.tickets && activity.tickets.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {activity.tickets.map((ticket) => (
              <Badge key={ticket} className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
                {ticket}
              </Badge>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Original layout (default)
  return (
    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs font-medium">
              {activity.meetingType}
            </Badge>
            <span className="text-sm text-gray-600 font-medium">
              {format(parseActivityDate(activity.date), "MMM d")}
            </span>
          </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 font-medium">
            {format(new Date(activity.timestamp), "h:mm a")}
          </span>
          {showActions && (
            <div className="flex gap-1">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Edit Activity</DialogTitle>
                    <DialogDescription>
                      Update the meeting type and activity details for this entry.
                    </DialogDescription>
                  </DialogHeader>
                  <ActivityForm 
                    onSubmit={handleEdit} 
                    isSubmitting={isEditing}
                    initialData={initialFormData}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Activity</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this activity? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
      {/* User Info */}
      {activity.userName && (
        <div className="flex items-center gap-2">
          <User className="h-3 w-3 text-gray-400" />
          <span className="text-xs font-medium text-gray-700">
            {activity.userName}
          </span>
        </div>
      )}
      
      <div 
        className="text-sm text-gray-900 leading-relaxed activity-content"
        dangerouslySetInnerHTML={{ __html: activity.summary }}
      />
      {activity.tickets && activity.tickets.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">TICKETS:</span>
          <div className="flex gap-1">
            {activity.tickets.map((ticket) => (
              <Badge key={ticket} className="bg-gray-200 text-gray-700 border-gray-300 text-xs">
                {ticket}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 