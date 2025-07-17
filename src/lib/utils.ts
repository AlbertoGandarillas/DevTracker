import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to parse activity date string correctly
export function parseActivityDate(dateString: string): Date {
  // If the date string contains time, extract just the date part
  const dateOnly = dateString.split('T')[0]
  // Create a date object using the local timezone
  const [year, month, day] = dateOnly.split('-').map(Number)
  return new Date(year, month - 1, day) // month is 0-indexed in JavaScript
}
