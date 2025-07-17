import { format } from "date-fns";
import * as XLSX from 'xlsx';
import { AdminActivity } from '@/types';
import { DATE_FORMATS, EXPORT_CONFIG } from './constants';
import { parseActivityDate } from './utils';

interface ExportData {
  Developer: string;
  Date: string;
  'Meeting Type': string;
  Summary: string;
  Tickets: string;
  Submitted: string;
}

export function exportActivitiesToExcel(activities: AdminActivity[]): void {
  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  
  // Prepare data for export
  const exportData: ExportData[] = activities.map(activity => ({
    Developer: activity.developer,
    Date: format(parseActivityDate(activity.date), DATE_FORMATS.FULL_DATE),
    'Meeting Type': activity.meetingType,
    Summary: activity.summary,
    Tickets: activity.tickets.join(', '),
    Submitted: format(new Date(activity.submittedAt), DATE_FORMATS.DATE_TIME)
  }));
  
  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  // Set column widths
  const columnWidths = [
    { wch: EXPORT_CONFIG.COLUMN_WIDTHS.DEVELOPER },
    { wch: EXPORT_CONFIG.COLUMN_WIDTHS.DATE },
    { wch: EXPORT_CONFIG.COLUMN_WIDTHS.MEETING_TYPE },
    { wch: EXPORT_CONFIG.COLUMN_WIDTHS.SUMMARY },
    { wch: EXPORT_CONFIG.COLUMN_WIDTHS.TICKETS },
    { wch: EXPORT_CONFIG.COLUMN_WIDTHS.SUBMITTED }
  ];
  worksheet['!cols'] = columnWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, EXPORT_CONFIG.WORKSHEET_NAME);
  
  // Generate filename with current date
  const fileName = `${EXPORT_CONFIG.FILENAME_PREFIX}-${format(new Date(), DATE_FORMATS.ISO_DATE)}.xlsx`;
  
  // Save file
  XLSX.writeFile(workbook, fileName);
} 