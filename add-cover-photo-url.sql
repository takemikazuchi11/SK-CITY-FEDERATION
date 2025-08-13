-- Add cover_photo_url field to barangays table
ALTER TABLE barangays ADD COLUMN cover_photo_url TEXT;

-- Add comment to describe the field
COMMENT ON COLUMN barangays.cover_photo_url IS 'URL for the background/cover photo of the barangay information section';
