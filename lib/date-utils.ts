/**
 * Formats a date string into a human-readable format
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string (e.g., "April 9, 2025")
 */
export function formatEventDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  /**
   * Checks if a date is in the past
   * @param dateString - Date string in YYYY-MM-DD format
   * @returns Boolean indicating if the date is in the past
   */
  export function isDatePast(dateString: string): boolean {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison
    const eventDate = new Date(dateString)
    return eventDate < today
  }
  
  /**
   * Checks if a date is today or in the future
   * @param dateString - Date string in YYYY-MM-DD format
   * @returns Boolean indicating if the date is today or in the future
   */
  export function isDateUpcoming(dateString: string): boolean {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison
    const eventDate = new Date(dateString)
    return eventDate >= today
  }
  
  /**
   * Sorts events by proximity to current date (closest first)
   * @param events - Array of events with date property
   * @returns Sorted array of events
   */
  export function sortEventsByProximity<T extends { date: string }>(events: T[]): T[] {
    return [...events].sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateA.getTime() - dateB.getTime()
    })
  }
  
  