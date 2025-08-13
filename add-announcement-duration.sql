-- Add display_duration field to announcements table
-- This field will store the number of days the announcement should be displayed on the homepage
-- If NULL, the announcement will be displayed indefinitely (current behavior)

ALTER TABLE announcements 
ADD COLUMN display_duration INTEGER;

-- Add an index for better performance when filtering by duration
CREATE INDEX idx_announcements_display_duration ON announcements(display_duration);

-- Add a comment to explain the field
COMMENT ON COLUMN announcements.display_duration IS 'Number of days the announcement should be displayed on homepage. If NULL, displays indefinitely.';
