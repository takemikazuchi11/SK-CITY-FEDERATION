# Enhanced AI Chatbot with Personalized Recommendations

## Overview

The SK Federation AI chatbot has been enhanced with intelligent personalization features that analyze user behavior and provide tailored recommendations based on their event participation history.

## New Features

### 1. User-Specific Context
- **Personalized Welcome Messages**: The chatbot greets users by name when logged in
- **User Profile Integration**: Includes user role, barangay, and participation history
- **Dynamic Suggested Queries**: Changes based on user's event history and preferences

### 2. Intelligent Event Analysis
- **Event Category Detection**: Automatically categorizes events based on keywords
- **Participation Rate Calculation**: Tracks user engagement with available events
- **Preference Learning**: Analyzes past registrations to understand user interests

### 3. Personalized Recommendations
- **Smart Event Scoring**: Ranks events based on user's favorite categories
- **Barangay-Specific Events**: Shows events in user's local area
- **Similar Event Suggestions**: Recommends events based on past participation

### 4. Enhanced Analytics
- **User Analytics Service**: Provides detailed insights about user behavior
- **Event Preference Tracking**: Identifies favorite event categories
- **Participation Trends**: Tracks engagement patterns over time

## Technical Implementation

### Files Modified

1. **`components/chatbot.tsx`**
   - Added user context to API requests
   - Personalized welcome messages
   - Dynamic suggested queries based on user status

2. **`app/api/chat/route.ts`**
   - Enhanced to accept user information
   - Integrated user analytics service
   - Added personalized context to AI prompts

3. **`lib/user-analytics.ts`** (New)
   - Comprehensive user analytics service
   - Event categorization and scoring
   - Personalized recommendation engine

### Database Integration

The chatbot now consumes data from:
- `event_participants` table for user registrations
- `events` table for event details and categorization
- `users` table for user profile information

### AI Context Enhancement

The chatbot now provides the AI with:
- User's registered events and participation history
- Event preferences based on past registrations
- Barangay-specific event recommendations
- Personalized event suggestions with scoring
- User analytics including participation rates

## Usage Examples

### For Logged-in Users

**Query**: "What events have I registered for?"
**Response**: Lists all events the user has registered for with dates and status

**Query**: "Suggest events based on my interests"
**Response**: Provides personalized recommendations based on past participation

**Query**: "Show me events in my barangay"
**Response**: Lists upcoming events in the user's local area

### For Anonymous Users

**Query**: "What are the most popular events?"
**Response**: Shows general event popularity data

**Query**: "Suggest new events"
**Response**: Provides general event suggestions based on overall trends

## API Endpoints

### Main Chat Endpoint
```
POST /api/chat
Body: {
  message: string,
  userId?: string,
  userRole?: string,
  userName?: string,
  userBarangay?: string
}
```

### Test Personalization Endpoint
```
GET /api/chat/test-personalization?userId=user-id
```

## Event Categories

The system automatically categorizes events into:
- **Sports & Athletics**: Basketball, volleyball, tournaments, fitness
- **Environment & Community**: Tree planting, clean-up drives, eco activities
- **Education & Training**: Workshops, seminars, skill development
- **Arts & Culture**: Cultural events, performances, creative activities
- **Community Service**: Volunteer programs, charity events
- **Technology**: Coding, digital skills, innovation
- **Leadership**: Youth development, empowerment programs

## Personalization Features

### 1. Event Preference Learning
- Analyzes event titles and descriptions
- Identifies recurring themes in user registrations
- Builds preference profile over time

### 2. Smart Recommendations
- Scores events based on user preferences
- Considers location proximity (barangay)
- Factors in participation history

### 3. Contextual Suggestions
- Adapts suggested queries based on user status
- Provides relevant follow-up questions
- Maintains conversation context

## Benefits

1. **Improved User Experience**: Personalized interactions feel more relevant
2. **Higher Engagement**: Users are more likely to participate in recommended events
3. **Better Event Discovery**: Users find events that match their interests
4. **Data-Driven Insights**: Administrators can understand user preferences
5. **Local Community Focus**: Emphasizes barangay-specific activities

## Future Enhancements

1. **Machine Learning Integration**: More sophisticated preference algorithms
2. **Real-time Notifications**: Alert users about events matching their interests
3. **Social Recommendations**: Suggest events based on friends' participation
4. **Seasonal Preferences**: Adapt recommendations based on time of year
5. **Feedback Loop**: Learn from user responses to improve recommendations

## Testing

To test the personalization features:

1. **Login as a user** with event registration history
2. **Open the chatbot** and ask personalized questions
3. **Test the API** using the test endpoint with a user ID
4. **Verify recommendations** match user's past participation

## Configuration

The chatbot uses environment variables:
- `GROQ_API_KEY`: For AI model access
- Database connection via Supabase configuration

No additional configuration is required for the personalization features. 