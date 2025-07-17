import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

interface AdminFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDeveloper: string;
  onDeveloperChange: (value: string) => void;
  selectedMeetingType: string;
  onMeetingTypeChange: (value: string) => void;
  developers: string[];
  meetingTypes: string[];
}

export function AdminFilters({
  searchTerm,
  onSearchChange,
  selectedDeveloper,
  onDeveloperChange,
  selectedMeetingType,
  onMeetingTypeChange,
  developers,
  meetingTypes,
}: AdminFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search and Filters Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Search & Filter</h2>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Badge variant="secondary" className="text-xs">
            {developers.length - 1} Developers
          </Badge>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
        {/* Search Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Search Activities</label>
          <Input
            placeholder="Search by summary, tickets, or developer..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Developer Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Filter by Developer</label>
          <FormControl fullWidth size="small">
            <Select
              value={selectedDeveloper}
              onChange={(e) => onDeveloperChange(e.target.value)}
            >
              {developers.map((developer) => (
                <MenuItem key={developer} value={developer}>
                  {developer}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Meeting Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Filter by Meeting Type</label>
          <FormControl fullWidth size="small">
            <Select
              value={selectedMeetingType}
              onChange={(e) => onMeetingTypeChange(e.target.value)}
            >
              {meetingTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );
} 