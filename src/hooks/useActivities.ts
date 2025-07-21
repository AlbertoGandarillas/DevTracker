import { useState, useEffect, useCallback } from 'react';
import { Activity, ApiResponse, AdminApiResponse } from '@/types';

interface UseActivitiesOptions {
  days?: number;
  limit?: number;
  isAdmin?: boolean;
  all?: boolean;
}

interface UseActivitiesReturn {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useActivities({ days = 7, limit = 10, isAdmin = false, all = false }: UseActivitiesOptions = {}): UseActivitiesReturn {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = isAdmin ? '/api/admin/activities' : '/api/activities';
      const params = new URLSearchParams();
      
      if (all) {
        params.append('all', 'true');
      } else {
        params.append('days', days.toString());
        params.append('limit', limit.toString());
      }
      
      const res = await fetch(`${endpoint}?${params}`);
      const data: ApiResponse | AdminApiResponse = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch activities');
      }
      
      if (isAdmin && 'activities' in data && Array.isArray(data.activities)) {
        setActivities(data.activities);
      } else if (!isAdmin && 'activities' in data && Array.isArray(data.activities)) {
        setActivities(data.activities);
      } else {
        setActivities([]);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch activities';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [days, limit, isAdmin, all]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities
  };
} 