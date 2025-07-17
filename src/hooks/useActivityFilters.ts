import { useState, useMemo } from 'react';
import { AdminActivity } from '@/types';

interface UseActivityFiltersOptions {
  activities: AdminActivity[];
}

interface UseActivityFiltersReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDeveloper: string;
  setSelectedDeveloper: (developer: string) => void;
  selectedMeetingType: string;
  setSelectedMeetingType: (type: string) => void;
  filteredActivities: AdminActivity[];
  meetingTypes: string[];
  developers: string[];
}

export function useActivityFilters({ activities }: UseActivityFiltersOptions): UseActivityFiltersReturn {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>("All");
  const [selectedMeetingType, setSelectedMeetingType] = useState<string>("All");

  // Extract unique meeting types and developers
  const meetingTypes = useMemo(() => 
    ["All", ...Array.from(new Set(activities.map(a => a.meetingType)))], 
    [activities]
  );

  const developers = useMemo(() => 
    ["All", ...Array.from(new Set(activities.map(a => a.developer)))], 
    [activities]
  );

  // Filtering logic
  const filteredActivities = useMemo(() => {
    let filtered = activities;
    
    if (searchTerm) {
      filtered = filtered.filter(
        (activity) =>
          activity.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.tickets.some((ticket: string) => ticket.includes(searchTerm)) ||
          activity.developer.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    
    if (selectedDeveloper !== "All") {
      filtered = filtered.filter((activity) => activity.developer === selectedDeveloper);
    }
    
    if (selectedMeetingType !== "All") {
      filtered = filtered.filter((activity) => activity.meetingType === selectedMeetingType);
    }
    
    return filtered;
  }, [activities, searchTerm, selectedDeveloper, selectedMeetingType]);

  return {
    searchTerm,
    setSearchTerm,
    selectedDeveloper,
    setSelectedDeveloper,
    selectedMeetingType,
    setSelectedMeetingType,
    filteredActivities,
    meetingTypes,
    developers,
  };
} 