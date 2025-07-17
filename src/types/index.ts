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

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  activities?: Activity[]
  users?: User[]
  stats?: Stats
}

export interface ActivityFormData {
  meetingType: string
  activityDetails: string
}

export interface ValidationErrors {
  meetingType?: string
  activityDetails?: string
} 