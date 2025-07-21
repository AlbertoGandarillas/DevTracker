"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Bell, Clock, Save } from "lucide-react"

interface UserSettingsData {
  timezone: string
  emailNotifications: boolean
  reminder12pm: boolean
  reminderEod: boolean
}

// Get timezones using browser's built-in API
const getTimezones = () => {
  try {
    // Use browser's built-in timezone list
    const timezoneList = Intl.supportedValuesOf('timeZone');
    
    // Filter and format timezones for better UX
    const commonTimezones = [
      'UTC',
      'America/Los_Angeles', // California
      'America/Lima', // Peru
      'America/Guatemala', // Guatemala
      'Europe/Amsterdam', // Netherlands
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Australia/Sydney',
    ];
    
    // Create a map of timezone to display name
    const timezoneMap = new Map();
    
    // Add common timezones first with friendly names
    commonTimezones.forEach(tz => {
      if (timezoneList.includes(tz)) {
        const offset = getTimezoneOffset(tz);
        timezoneMap.set(tz, `${getTimezoneDisplayName(tz)} (${offset})`);
      }
    });
    
    // Add remaining timezones
    timezoneList.forEach(tz => {
      if (!timezoneMap.has(tz)) {
        const offset = getTimezoneOffset(tz);
        timezoneMap.set(tz, `${tz} (${offset})`);
      }
    });
    
    return Array.from(timezoneMap.entries()).map(([value, label]) => ({
      value,
      label
    }));
  } catch {
    // Fallback to static list if browser doesn't support it
    console.warn('Browser doesn\'t support Intl.supportedValuesOf, using fallback');
    return [
      { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
      { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
      { value: 'America/Lima', label: 'Peru Time (PET)' },
      { value: 'America/Guatemala', label: 'Guatemala Time (CST)' },
      { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)' },
      { value: 'America/New_York', label: 'Eastern Time (ET)' },
      { value: 'America/Chicago', label: 'Central Time (CT)' },
      { value: 'America/Denver', label: 'Mountain Time (MT)' },
      { value: 'Europe/London', label: 'London (GMT/BST)' },
      { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
      { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
      { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
      { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
      { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
    ];
  }
};

// Helper function to get timezone offset
const getTimezoneOffset = (timezone: string) => {
  try {
    const date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const targetTime = new Date(utc + (0 * 60000));
    const offset = targetTime.toLocaleString('en-US', { timeZone: timezone, timeZoneName: 'short' });
    return offset.split(' ').pop() || '';
  } catch {
    return '';
  }
};

// Helper function to get friendly timezone names
const getTimezoneDisplayName = (timezone: string) => {
  const names: Record<string, string> = {
    'UTC': 'UTC (Coordinated Universal Time)',
    'America/Los_Angeles': 'Pacific Time (PT)',
    'America/Lima': 'Peru Time (PET)',
    'America/Guatemala': 'Guatemala Time (CST)',
    'Europe/Amsterdam': 'Amsterdam (CET/CEST)',
    'America/New_York': 'Eastern Time (ET)',
    'America/Chicago': 'Central Time (CT)',
    'America/Denver': 'Mountain Time (MT)',
    'Europe/London': 'London (GMT/BST)',
    'Europe/Paris': 'Paris (CET/CEST)',
    'Europe/Berlin': 'Berlin (CET/CEST)',
    'Asia/Tokyo': 'Tokyo (JST)',
    'Asia/Shanghai': 'Shanghai (CST)',
    'Australia/Sydney': 'Sydney (AEST/AEDT)',
  };
  
  return names[timezone] || timezone;
};

const timezones = getTimezones();

export function UserSettings() {
  const [settings, setSettings] = useState<UserSettingsData>({
    timezone: 'UTC',
    emailNotifications: true,
    reminder12pm: true,
    reminderEod: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchUserSettings()
  }, [])

  const fetchUserSettings = async () => {
    try {
      const response = await fetch('/api/user/me')
      if (response.ok) {
        const data = await response.json()
        // The API returns data wrapped in a 'user' object
        const userData = data.user || data
        console.log('Fetched user data:', userData) // Debug log
        setSettings({
          timezone: userData.timezone || 'UTC',
          emailNotifications: userData.emailNotifications ?? true,
          reminder12pm: userData.reminder12pm ?? true,
          reminderEod: userData.reminderEod ?? true,
        })
      }
    } catch (error) {
      console.error('Error fetching user settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast.success('Settings saved successfully', {
          description: 'Your notification preferences have been updated.',
        })
        // Refresh the settings from the server to ensure we have the latest data
        await fetchUserSettings()
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      toast.error('Failed to save settings', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      })
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: keyof UserSettingsData, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="w-full space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
          <h1 className="text-3xl font-bold tracking-tight text-indigo-900">
            Settings
          </h1>
          <p className="text-indigo-700 mt-1 font-medium">Manage your preferences</p>
        </div>
        <div className="text-center py-8">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <h1 className="text-3xl font-bold tracking-tight text-indigo-900">
          Settings
        </h1>
        <p className="text-indigo-700 mt-1 font-medium">Manage your notification preferences and timezone</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Timezone Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timezone
            </CardTitle>
            <CardDescription>
              Set your local timezone for accurate reminder timing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Timezone</label>
              <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Email Notifications
            </CardTitle>
            <CardDescription>
              Configure when you receive reminder emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Email Notifications</label>
                <p className="text-sm text-gray-500">Receive reminder emails</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
              />
            </div>

            {settings.emailNotifications && (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">12pm Reminders</label>
                    <p className="text-sm text-gray-500">Daily 12pm update reminders</p>
                  </div>
                  <Switch
                    checked={settings.reminder12pm}
                    onCheckedChange={(checked) => updateSetting('reminder12pm', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">EOD Reminders</label>
                    <p className="text-sm text-gray-500">Daily 6pm EOD update reminders</p>
                  </div>
                  <Switch
                    checked={settings.reminderEod}
                    onCheckedChange={(checked) => updateSetting('reminderEod', checked)}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
} 