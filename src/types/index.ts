export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

export interface Activity {
  id: string
  date: string
  meetingType: string
  summary: string
  timestamp: string
  userName?: string
  tickets?: string[]
}

export interface AdminActivity extends Activity {
  developer: string
  tickets: string[]
  submittedAt: string
}

export interface Stats {
  totalActivities: number
  activeDevelopers: number
  thisWeek: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  activities?: Activity[]
  users?: User[]
  user?: User
  stats?: Stats
}

export interface AdminApiResponse {
  success: boolean
  activities?: AdminActivity[]
  stats?: Stats
  error?: string
}

export interface ActivityFormData {
  meetingType: string
  activityDetails: string
  date?: string
  createdAt?: string
}

export interface ValidationErrors {
  meetingType?: string
  activityDetails?: string
} 