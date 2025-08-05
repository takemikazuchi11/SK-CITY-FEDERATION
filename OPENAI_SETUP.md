# OpenAI GPT-4 Integration Setup Guide

## 🚀 Quick Setup

### 1. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to "API Keys" section
4. Create a new API key
5. Copy the key (starts with `sk-`)

### 2. Configure Environment Variables
Create or update `.env.local` in your project root:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-api-key-here

# Existing Supabase Configuration (keep these)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq Configuration (for fallback)
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Test the Integration
Visit: `http://localhost:3000/api/chat/test-openai`

Expected response:
```json
{
  "success": true,
  "test_message": "Show me upcoming events",
  "response": "Based on the events in our database...",
  "openai_configured": true
}
```

## 🔧 How It Works

### OpenAI with Function Calling
- **Primary**: Uses OpenAI GPT-4 with function calling
- **Functions**: Direct database queries for events, announcements, news
- **Benefits**: Real-time data, accurate responses, better context

### Fallback System
- **Secondary**: Falls back to Groq if OpenAI fails
- **Context**: Still provides database context to Groq
- **Reliability**: Ensures chatbot always works

### API Routes Available
1. `/api/chat/hybrid-route` - **Recommended** (OpenAI + Groq fallback)
2. `/api/chat/openai-route` - OpenAI only
3. `/api/chat/route` - Original Groq only
4. `/api/chat/test-openai` - Test OpenAI integration

## 🎯 Features

### ✅ What's Working
- **Function Calling**: AI can directly query your database
- **Real-time Data**: Always gets fresh data from Supabase
- **Smart Fallback**: Uses Groq if OpenAI fails
- **Error Handling**: Graceful error handling and logging
- **Cost Effective**: More efficient than current Groq setup

### 🔄 Database Functions Available
- `get_events()` - Fetch events with filters
- `get_announcements()` - Fetch announcements
- `get_news()` - Fetch news articles
- `get_user_participation()` - Get user's event history
- `search_content()` - Search across all content

## 🧪 Testing

### Test Database Connection
```bash
curl http://localhost:3000/api/chat/test-db
```

### Test OpenAI Integration
```bash
curl http://localhost:3000/api/chat/test-openai
```

### Test Chatbot
1. Start your development server: `npm run dev`
2. Open the chatbot on your website
3. Ask: "Show me upcoming events"
4. Check console logs for function calls

## 💰 Cost Comparison

| Service | Cost per 1K tokens | Context Length | Features |
|---------|-------------------|----------------|----------|
| **OpenAI GPT-4** | $0.03 | 128K | Function calling, best reasoning |
| **Groq (current)** | $0.05 | 32K | Fast, but limited features |
| **Claude 3.5** | $0.15 | 200K | Best reasoning, expensive |
| **Gemini Pro** | $0.0025 | 32K | Very cheap, good performance |

## 🚨 Troubleshooting

### OpenAI API Key Issues
```bash
# Check if API key is set
echo $OPENAI_API_KEY

# Restart development server
npm run dev
```

### Database Connection Issues
```bash
# Test database connection
curl http://localhost:3000/api/chat/test-db
```

### Function Calling Issues
Check console logs for:
- Function call attempts
- Database query results
- Error messages

## 🎉 Next Steps

1. **Add your OpenAI API key** to `.env.local`
2. **Test the integration** using the test endpoints
3. **Try the chatbot** with real queries
4. **Monitor costs** in OpenAI dashboard
5. **Fine-tune functions** based on usage patterns

## 📊 Monitoring

### OpenAI Dashboard
- Visit: https://platform.openai.com/usage
- Monitor: Token usage, costs, API calls

### Console Logs
- Function calls: `Calling function: get_events with args:`
- Database queries: `Fetched X events and Y announcements`
- Errors: `Error in OpenAI Assistant:`

## 🔄 Migration Path

### Phase 1: Test (Today)
- ✅ Install OpenAI SDK
- ✅ Add API key
- ✅ Test integration

### Phase 2: Deploy (This week)
- ✅ Use hybrid route in production
- ✅ Monitor performance
- ✅ Optimize function calls

### Phase 3: Optimize (Next week)
- ✅ Add more specialized functions
- ✅ Implement caching
- ✅ Add analytics

---

**Need help?** Check the console logs or test endpoints for detailed error information. 