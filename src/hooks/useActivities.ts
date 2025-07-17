import { useState, useEffect } from 'react';
import { Activity, AdminActivity, ApiResponse } from '@/types';

interface UseActivitiesOptions {
  days?: number;
  limit?: number;
  date?: string;
  all?: boolean;
}

interface UseActivitiesReturn {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useActivities(options: UseActivitiesOptions = {}): UseActivitiesReturn {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { days = 7, limit = 10, date, all = false } = options;

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (days) params.append('days', days.toString());
      if (limit) params.append('limit', limit.toString());
      if (date) params.append('date', date);
      if (all) params.append('all', 'true');

      const res = await fetch(`/api/activities?${params.toString()}`);
      const data: ApiResponse = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch activities');
      }
      
      setActivities(data.activities || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [days, limit, date, all]);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities
  };
}

export function useAdminActivities() {
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [stats, setStats] = useState({ totalActivities: 0, activeDevelopers: 0, thisWeek: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminActivities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/admin/activities');
      const data: ApiResponse = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch admin activities');
      }
      
      setActivities(data.activities || []);
      setStats(data.stats || { totalActivities: 0, activeDevelopers: 0, thisWeek: 0 });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admin activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminActivities();
  }, []);

  return {
    activities,
    stats,
    loading,
    error,
    refetch: fetchAdminActivities
  };
} 