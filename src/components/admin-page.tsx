"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Filter, Users, Activity, Calendar, AlertCircle } from "lucide-react"
import { MaterialReactTable } from "material-react-table"
import { Box, MenuItem, Select, FormControl, InputLabel, Alert } from "@mui/material"
import { StatsCard } from "@/components/ui/stats-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { useAdminActivities } from "@/hooks/useActivities"
import { useUsers } from "@/hooks/useUser"
import { AdminActivity, User } from "@/types"

export function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>("All")
  const [selectedMeetingType, setSelectedMeetingType] = useState<string>("All")
  
  const { activities, stats, loading, error } = useAdminActivities()
  const { users, loading: loadingUsers, error: usersError } = useUsers()

  const meetingTypes = useMemo(() => ["All", ...Array.from(new Set(activities.map(a => a.meetingType)))], [activities])

  // Filtering logic
  const filteredActivities = useMemo(() => {
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
    return filtered
  }, [activities, searchTerm, selectedDeveloper, selectedMeetingType])

  const handleExportCSV = () => {
    // Export CSV functionality (can be implemented with Material React Table's built-in export)
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Overview</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage team activity across all developers</p>
        </div>
        <LoadingSpinner text="Loading admin data..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Overview</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage team activity across all developers</p>
        </div>
        <ErrorMessage message={error} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Overview</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage team activity across all developers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Activities"
          value={stats.totalActivities}
          description="All time entries"
          icon={Activity}
        />
        <StatsCard
          title="Active Developers"
          value={stats.activeDevelopers}
          description="Team members logging activities"
          icon={Users}
        />
        <StatsCard
          title="This Week"
          value={stats.thisWeek}
          description="Recent activity entries"
          icon={Calendar}
        />
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
