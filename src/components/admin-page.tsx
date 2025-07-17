"use client"

import { useMemo } from "react"
import { Download } from "lucide-react"
import { MaterialReactTable } from "material-react-table"
import { Button } from "@/components/ui/button"
import { StatsCard } from "@/components/ui/stats-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"
import { useAdminActivities } from "@/hooks/useActivities"
import { useActivityFilters } from "@/hooks/useActivityFilters"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { AdminFilters } from "@/components/admin/AdminFilters"
import { getAdminTableColumns } from "@/components/admin/tableConfig"
import { exportActivitiesToExcel } from "@/lib/exportUtils"
import { Activity, Users, Calendar } from "lucide-react"

export function AdminPage() {
  const { activities, stats, loading, error } = useAdminActivities()
  
  const {
    searchTerm,
    setSearchTerm,
    selectedDeveloper,
    setSelectedDeveloper,
    selectedMeetingType,
    setSelectedMeetingType,
    filteredActivities,
    meetingTypes,
    developers,
  } = useActivityFilters({ activities })

  const columns = useMemo(() => getAdminTableColumns(), [])

  const handleExportExcel = () => {
    exportActivitiesToExcel(filteredActivities)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminHeader stats={stats} loading={true} />
        
        {/* Stats Cards - Mobile Only */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
          <StatsCard
            title="Total Activities"
            value={0}
            icon={Activity}
            description="All time activities"
            accentColor="text-purple-600"
          />
          <StatsCard
            title="Active Developers"
            value={0}
            icon={Users}
            description="Currently active"
            accentColor="text-blue-600"
          />
          <StatsCard
            title="This Week"
            value={0}
            icon={Calendar}
            description="Activities this week"
            accentColor="text-green-600"
          />
        </div>
        <LoadingSpinner text="Loading admin data..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <AdminHeader stats={stats} />
        <ErrorMessage 
          title="Failed to load admin data" 
          message={error}
          retry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <AdminHeader stats={stats} />

      {/* Stats Cards - Mobile Only */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
        <StatsCard
          title="Total Activities"
          value={stats.totalActivities}
          icon={Activity}
          description="All time activities"
          accentColor="text-purple-600"
        />
        <StatsCard
          title="Active Developers"
          value={stats.activeDevelopers}
          icon={Users}
          description="Currently active"
          accentColor="text-blue-600"
        />
        <StatsCard
          title="This Week"
          value={stats.thisWeek}
          icon={Calendar}
          description="Activities this week"
          accentColor="text-green-600"
        />
      </div>

      {/* Search and Filters */}
      <AdminFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDeveloper={selectedDeveloper}
        onDeveloperChange={setSelectedDeveloper}
        selectedMeetingType={selectedMeetingType}
        onMeetingTypeChange={setSelectedMeetingType}
        developers={developers}
        meetingTypes={meetingTypes}
      />

      {/* Export Button */}
      <div className="flex justify-end">
        <Button onClick={handleExportExcel} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      {/* Activities Table */}
      <MaterialReactTable
        columns={columns}
        data={filteredActivities}
        enableColumnFilters={false}
        enableSorting={true}
        enablePagination={true}
        enableRowSelection={false}
        muiTableProps={{
          sx: {
            tableLayout: 'fixed',
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: '#f8fafc',
            fontWeight: '600',
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            borderBottom: '1px solid #e2e8f0',
          },
        }}
        initialState={{
          pagination: {
            pageSize: 25,
            pageIndex: 0,
          },
          sorting: [
            {
              id: 'date',
              desc: true,
            },
          ],
        }}
      />
    </div>
  )
}
