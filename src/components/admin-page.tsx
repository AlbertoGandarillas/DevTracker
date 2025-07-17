"use client"

import { useState, useEffect, useMemo } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AppLayout } from "@/components/app-layout"
import { Search, Download, Filter, Users, Activity, Calendar, AlertCircle } from "lucide-react"
import { MaterialReactTable } from "material-react-table"
import { Box, MenuItem, Select, FormControl, InputLabel, Alert } from "@mui/material"

// TypeScript interfaces
interface Activity {
  id: string
  developer: string
  date: string
  meetingType: string
  summary: string
  tickets: string[]
  submittedAt: string
}

interface User {
  id: string
  name: string
  email: string
}

interface Stats {
  totalActivities: number
  activeDevelopers: number
  thisWeek: number
}

export function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>("All")
  const [selectedMeetingType, setSelectedMeetingType] = useState<string>("All")
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<Stats>({ totalActivities: 0, activeDevelopers: 0, thisWeek: 0 })
  const [loading, setLoading] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usersError, setUsersError] = useState<string | null>(null)

  const meetingTypes = useMemo(() => ["All", ...Array.from(new Set(activities.map(a => a.meetingType)))], [activities])

  // Fetch activities
  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch("/api/admin/activities")
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.error || "Failed to fetch activities")
        setActivities(data.activities || [])
        setStats(data.stats || { totalActivities: 0, activeDevelopers: 0, thisWeek: 0 })
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch activities")
        setLoading(false)
      })
  }, [])

  // Fetch users for developer dropdown
  useEffect(() => {
    setLoadingUsers(true)
    setUsersError(null)
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error(data.error || "Failed to fetch users")
        setUsers(data.users || [])
        setLoadingUsers(false)
      })
      .catch((err) => {
        setUsersError(err.message || "Failed to fetch users")
        setLoadingUsers(false)
      })
  }, [])

  // Filtering logic
  useEffect(() => {
    let filtered = activities
    if (searchTerm) {
      filtered = filtered.filter(
        (activity) =>
          activity.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.tickets.some((ticket: string) => ticket.includes(searchTerm)) ||
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
  }, [activities, searchTerm, selectedDeveloper, selectedMeetingType])

  const handleExportCSV = () => {
    // Export CSV functionality (can be implemented with Material React Table's built-in export)
    // For now, just log
    console.log("Exporting CSV...")
  }

  // Material React Table columns
  const columns = useMemo(() => [
    {
      accessorKey: "developer",
      header: "Developer",
      size: 140,
    },
    {
      accessorKey: "date",
      header: "Date",
      size: 100,
      Cell: ({ cell }: any) => format(new Date(cell.getValue()), "MMM d"),
    },
    {
      accessorKey: "meetingType",
      header: "Meeting Type",
      size: 160,
      Cell: ({ cell }: any) => <Badge variant="secondary">{cell.getValue()}</Badge>,
    },
    {
      accessorKey: "summary",
      header: "Summary",
      size: 300,
      Cell: ({ cell }: any) => (
        <Box sx={{ maxWidth: 350, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={cell.getValue()}>
          {cell.getValue()}
        </Box>
      ),
    },
    {
      accessorKey: "tickets",
      header: "Tickets",
      size: 120,
      Cell: ({ cell }: any) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {cell.getValue()?.map((ticket: string) => (
            <Badge key={ticket} variant="outline" className="text-xs">#{ticket}</Badge>
          ))}
        </Box>
      ),
    },
    {
      accessorKey: "submittedAt",
      header: "Submitted",
      size: 160,
      Cell: ({ cell }: any) => format(new Date(cell.getValue()), "h:mm a"),
    },
  ], [])

  return (
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
            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel id="developer-select-label">Developer</InputLabel>
              <Select
                labelId="developer-select-label"
                value={selectedDeveloper}
                label="Developer"
                onChange={(e) => setSelectedDeveloper(e.target.value)}
                disabled={loadingUsers}
              >
                <MenuItem value="All">All</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.name}>{user.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel id="meeting-type-select-label">Meeting Type</InputLabel>
              <Select
                labelId="meeting-type-select-label"
                value={selectedMeetingType}
                label="Meeting Type"
                onChange={(e) => setSelectedMeetingType(e.target.value)}
              >
                {meetingTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
          {error && <Alert severity="error" sx={{ mt: 2 }} icon={<AlertCircle />}>{error}</Alert>}
          {usersError && <Alert severity="error" sx={{ mt: 2 }} icon={<AlertCircle />}>{usersError}</Alert>}
        </CardContent>
      </Card>

      {/* Activities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Activities</CardTitle>
          <CardDescription>
            Showing {filteredActivities.length} of {activities.length} activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MaterialReactTable
            columns={columns}
            data={filteredActivities}
            state={{ isLoading: loading }}
            enableColumnResizing
            enableSorting
            enableGlobalFilter={false}
            enableColumnFilters={false}
            enablePagination
            muiTableBodyRowProps={{ hover: true }}
            initialState={{ density: 'compact', pagination: { pageSize: 10, pageIndex: 0 } }}
            positionToolbarAlertBanner="bottom"
          />
        </CardContent>
      </Card>
    </div>
  )
}
