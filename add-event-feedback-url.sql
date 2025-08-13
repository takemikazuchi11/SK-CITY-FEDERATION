-- Add feedback_url field to events table
-- This field will store the Google Form URL for event feedback

ALTER TABLE events
ADD COLUMN feedback_url VARCHAR(500);

-- Add an index for better performance when filtering by feedback_url
CREATE INDEX idx_events_feedback_url ON events(feedback_url);

-- Add a comment to explain the field
COMMENT ON COLUMN events.feedback_url IS 'Google Form URL for collecting event feedback. If provided, the feedback button will redirect to this URL.';
