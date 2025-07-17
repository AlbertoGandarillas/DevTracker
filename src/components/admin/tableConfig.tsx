import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Box } from "@mui/material";
import { parseActivityDate } from "@/lib/utils";
import { DATE_FORMATS } from "@/lib/constants";
import { AdminActivity } from "@/types";
import { MRT_ColumnDef } from "material-react-table";

export const getAdminTableColumns = (): MRT_ColumnDef<AdminActivity>[] => [
  {
    accessorKey: "developer",
    header: "Developer",
    size: 140,
    Cell: ({ cell }) => (
      <span className="font-medium text-gray-900">
        {cell.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    size: 100,
    Cell: ({ cell }) => (
      <span className="text-gray-700">
        {format(parseActivityDate(cell.getValue<string>()), DATE_FORMATS.DISPLAY)}
      </span>
    ),
  },
  {
    accessorKey: "meetingType",
    header: "Meeting Type",
    size: 160,
    Cell: ({ cell }) => (
      <Badge variant="secondary" className="text-xs font-medium bg-blue-100 text-blue-700 border-blue-200">
        {cell.getValue<string>()}
      </Badge>
    ),
  },
  {
    accessorKey: "summary",
    header: "Summary",
    size: 300,
    Cell: ({ cell }) => (
      <Box 
        sx={{ 
          maxWidth: 350, 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          fontFamily: 'inherit',
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          color: '#374151',
        }} 
        title={cell.getValue<string>()}
      >
        {cell.getValue<string>()}
      </Box>
    ),
  },
  {
    accessorKey: "tickets",
    header: "Tickets",
    size: 120,
    Cell: ({ cell }) => (
      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {cell.getValue<string[]>()?.map((ticket: string) => (
          <Badge 
            key={ticket} 
            variant="outline" 
            className="text-xs font-medium bg-gray-50 text-gray-700 border-gray-200"
          >
            #{ticket}
          </Badge>
        ))}
      </Box>
    ),
  },
  {
    accessorKey: "submittedAt",
    header: "Submitted",
    size: 160,
    Cell: ({ cell }) => (
      <span className="text-gray-600 text-sm">
        {format(new Date(cell.getValue<string>()), DATE_FORMATS.TIME)}
      </span>
    ),
  },
]; 