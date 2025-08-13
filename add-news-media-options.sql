-- Add media type options for news articles
-- This allows news to have either a featured image URL or a YouTube embedded video

ALTER TABLE news
ADD COLUMN media_type VARCHAR(20) DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
ADD COLUMN youtube_video_id VARCHAR(20);

-- Add an index for better performance when filtering by media type
CREATE INDEX idx_news_media_type ON news(media_type);

-- Add comments to explain the new fields
COMMENT ON COLUMN news.media_type IS 'Type of media: "image" for featured image, "video" for YouTube video';
COMMENT ON COLUMN news.youtube_video_id IS 'YouTube video ID (extracted from URL) when media_type is "video"';

-- Update existing records to have media_type = 'image' if they have featured_image_url
UPDATE news 
SET media_type = 'image' 
WHERE featured_image_url IS NOT NULL AND featured_image_url != '';

-- Set media_type to 'image' for records without featured_image_url (default behavior)
UPDATE news 
SET media_type = 'image' 
WHERE media_type IS NULL;
