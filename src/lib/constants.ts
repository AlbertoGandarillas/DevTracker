// API Configuration
export const API_CONFIG = {
  DEFAULT_DAYS: 7,
  DEFAULT_LIMIT: 10,
  MAX_DAYS: 365,
  MAX_LIMIT: 100,
  MIN_DAYS: 1,
  MIN_LIMIT: 1,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "MMM d",
  FULL_DATE: "MMM d, yyyy",
  TIME: "h:mm a",
  DATE_TIME: "MMM d, yyyy h:mm a",
  ISO_DATE: "yyyy-MM-dd",
  FULL_DISPLAY: "EEEE, MMMM do, yyyy",
  WEEK_DISPLAY: "MMMM do",
} as const;

// Navigation
export const NAVIGATION = [
  { name: "Dashboard", href: "/", icon: "Activity" },
  { name: "History", href: "/history", icon: "Calendar" },
  { name: "Settings", href: "/settings", icon: "Settings" },
  { name: "Admin", href: "/admin", icon: "Settings", adminOnly: true },
] as const;

export type NavigationItem = typeof NAVIGATION[number];

// Meeting Types (if you want to standardize these)
export const MEETING_TYPES = [
  "Daily Standup",
  "Code Review", 
  "Planning",
  "Dev Meeting",
  "12pm Updates",
  "Stand-up",
  "EOD Update",
] as const;

// UI Configuration
export const UI_CONFIG = {
  MOBILE_BREAKPOINT: "md",
  DESKTOP_BREAKPOINT: "lg",
  ANIMATION_DURATION: 300,
  SCROLL_THRESHOLD: 0,
} as const;

// Export Configuration
export const EXPORT_CONFIG = {
  COLUMN_WIDTHS: {
    DEVELOPER: 15,
    DATE: 12,
    MEETING_TYPE: 15,
    SUMMARY: 50,
    TICKETS: 20,
    SUBMITTED: 20,
  },
  FILENAME_PREFIX: "team-activities",
  WORKSHEET_NAME: "Team Activities",
} as const; 