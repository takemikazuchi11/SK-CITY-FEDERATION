/**
 * YouTube utility functions for handling video IDs and thumbnails
 */

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeId(url: string): string {
  if (!url) return ""
  
  // Handle different YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  // If no pattern matches, assume it's already a video ID
  return url
}

/**
 * Get the best available YouTube thumbnail URL with fallback options
 * @param videoId - YouTube video ID
 * @param preferredQuality - Preferred thumbnail quality (default: 'maxresdefault')
 * @returns Object with primary and fallback thumbnail URLs
 */
export function getYouTubeThumbnailUrls(videoId: string, preferredQuality: 'maxresdefault' | 'hqdefault' | 'mqdefault' = 'maxresdefault') {
  const baseUrl = `https://img.youtube.com/vi/${videoId}`
  
  // Quality options in order of preference
  const qualities = ['maxresdefault', 'hqdefault', 'mqdefault', 'sddefault']
  
  // Reorder based on preferred quality
  const reorderedQualities = [
    preferredQuality,
    ...qualities.filter(q => q !== preferredQuality)
  ]
  
  return {
    primary: `${baseUrl}/${reorderedQualities[0]}.jpg`,
    fallback: `${baseUrl}/${reorderedQualities[1]}.jpg`,
    allQualities: reorderedQualities.map(quality => `${baseUrl}/${quality}.jpg`)
  }
}

/**
 * Get a single YouTube thumbnail URL with automatic fallback
 * @param videoId - YouTube video ID
 * @param quality - Preferred thumbnail quality
 * @returns Thumbnail URL
 */
export function getYouTubeThumbnailUrl(videoId: string, quality: 'maxresdefault' | 'hqdefault' | 'mqdefault' = 'maxresdefault'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}

/**
 * Validate if a string is a valid YouTube video ID
 * @param videoId - String to validate
 * @returns Boolean indicating if it's a valid YouTube video ID
 */
export function isValidYouTubeVideoId(videoId: string): boolean {
  // YouTube video IDs are typically 11 characters long and contain alphanumeric characters, hyphens, and underscores
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId)
}
