import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Checks if a date is in the past
 * @param dateString Date string in YYYY-MM-DD format
 * @returns boolean indicating if the date is in the past
 */
export function isDatePast(dateString: string): boolean {
  const date = new Date(dateString)
  date.setHours(23, 59, 59, 999) // Set to end of day for accurate comparison

  const today = new Date()

  return date < today
}

/**
 * Checks if a date is today or in the future
 * @param dateString Date string in YYYY-MM-DD format
 * @returns boolean indicating if the date is today or in the future
 */
export function isDateUpcoming(dateString: string): boolean {
  const date = new Date(dateString)
  date.setHours(0, 0, 0, 0) // Set to start of day for accurate comparison

  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time to start of day

  return date >= today
}

