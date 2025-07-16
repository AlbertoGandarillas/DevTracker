"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AppLayout } from "@/components/app-layout"
import { Search, Download, Filter, Users, Activity, Calendar } from "lucide-react"

// Mock team activity data
const mockTeamActivities = [
  {
    id: 1,
    developer: "Carlos",
    date: "2024-01-15",
    meetingType: "Dev Meeting",
    summary: "Discussed remaining items for 1376 sticking to the pre reqs grid",
    tickets: ["1376"],
    submittedAt: "2:30 PM",
  },
  {
    id: 2,
    developer: "David",
    date: "2024-01-15",
    meetingType: "EOD Update",
    summary: "Working on 1822, db changes",
    tickets: ["1822"],
    submittedAt: "5:45 PM",
  },
  {
    id: 3,
    developer: "Diego",
    date: "2024-01-15",
    meetingType: "12pm Updates",
    summary: "Working on 1883. Lisa will send a script to update exhibit name. On card 1834, I will change the Type",
    tickets: ["1883", "1834"],
    submittedAt: "12:15 PM",
  },
  {
    id: 4,
    developer: "Ivan",
    date: "2024-01-14",
    meetingType: "Dev Meeting",
    summary: "Working on card 1834 changes. Lisa already sent the script. After finishing 1834 I will jump to 1840",
    tickets: ["1834", "1840"],
    submittedAt: "2:30 PM",
  },
  {
    id: 5,
    developer: "Juan",
    date: "2024-01-14",
    meetingType: "EOD Update",
    summary: "Working on 1881 at 90%",
    tickets: ["1881"],
    submittedAt: "5:30 PM",
  },
  {
    id: 6,
    developer: "Lisa",
    date: "2024-01-14",
    meetingType: "12pm Updates",
    summary:
      "Created a task list for exhibit module for Diego on 1541, will continue to work on 1840 (new login page auth)",
    tickets: ["1541", "1840"],
    submittedAt: "12:10 PM",
  },
]

const developers = ["All", "Carlos", "David", "Diego", "Ivan", "Juan", "Lisa"]
const meetingTypes = ["All", "Dev Meeting", "EOD Update", "12pm Updates", "Stand-up", "Code Review"]

export function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDeveloper, setSelectedDeveloper] = useState("All")
  const [selectedMeetingType, setSelectedMeetingType] = useState("All")
  const [filteredActivities, setFilteredActivities] = useState(mockTeamActivities)

  // Filter activities based on search and filters
  const applyFilters = () => {
    let filtered = mockTeamActivities

    if (searchTerm) {
      filtered = filtered.filter(
        (activity) =>
          activity.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.tickets.some((ticket) => ticket.includes(searchTerm)) ||
          activity.developer.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedDeveloper !== "All") {
      filtered = filtered.filter((activity) => activity.developer === selectedDeveloper)
    }

    if (selectedMeetingType !== "All") {
      filtered = filtered.filter((activity) => activity.meetingType === selectedMeetingType)
    }

    setFilteredActivities(filtered)
  }

  // Apply filters whenever search term or filters change
  useState(() => {
    applyFilters()
  })

  const handleExportCSV = () => {
    // Mock CSV export functionality
    console.log("Exporting CSV...")
  }

  const stats = {
    totalActivities: mockTeamActivities.length,
    activeDevelopers: new Set(mockTeamActivities.map((a) => a.developer)).size,
    thisWeek: mockTeamActivities.filter((a) => new Date(a.date) >= new Date("2024-01-14")).length,
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Overview</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage team activity across all developers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalActivities}</div>
              <p className="text-xs text-muted-foreground">All time entries</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Developers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeDevelopers}</div>
              <p className="text-xs text-muted-foreground">Team members logging activities</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisWeek}</div>
              <p className="text-xs text-muted-foreground">Recent activity entries</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
            <CardDescription>Filter team activities by developer, meeting type, or search terms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search activities, tickets, or developers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedDeveloper} onValueChange={setSelectedDeveloper}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Developer" />
                </SelectTrigger>
                <SelectContent>
                  {developers.map((dev) => (
                    <SelectItem key={dev} value={dev}>
                      {dev}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedMeetingType} onValueChange={setSelectedMeetingType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Meeting Type" />
                </SelectTrigger>
                <SelectContent>
                  {meetingTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activities Table */}
        <Card>
          <CardHeader>
            <CardTitle>Team Activities</CardTitle>
            <CardDescription>
              Showing {filteredActivities.length} of {mockTeamActivities.length} activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Developer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Meeting Type</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Tickets</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.developer}</TableCell>
                      <TableCell>{format(new Date(activity.date), "MMM d")}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{activity.meetingType}</Badge>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate" title={activity.summary}>
                          {activity.summary}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {activity.tickets.map((ticket) => (
                            <Badge key={ticket} variant="outline" className="text-xs">
                              #{ticket}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{activity.submittedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
