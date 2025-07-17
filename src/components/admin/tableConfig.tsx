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
  },
  {
    accessorKey: "date",
    header: "Date",
    size: 100,
    Cell: ({ cell }) => format(parseActivityDate(cell.getValue<string>()), DATE_FORMATS.DISPLAY),
  },
  {
    accessorKey: "meetingType",
    header: "Meeting Type",
    size: 160,
    Cell: ({ cell }) => <Badge variant="secondary">{cell.getValue<string>()}</Badge>,
  },
  {
    accessorKey: "summary",
    header: "Summary",
    size: 300,
    Cell: ({ cell }) => (
      <Box sx={{ maxWidth: 350, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={cell.getValue<string>()}>
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
          <Badge key={ticket} variant="outline" className="text-xs">#{ticket}</Badge>
        ))}
      </Box>
    ),
  },
  {
    accessorKey: "submittedAt",
    header: "Submitted",
    size: 160,
    Cell: ({ cell }) => format(new Date(cell.getValue<string>()), DATE_FORMATS.TIME),
  },
]; 