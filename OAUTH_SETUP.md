# Google OAuth Setup Guide

This guide will help you configure Google OAuth with Supabase to work properly with your custom domain.

## Prerequisites

- Supabase project with Google OAuth provider configured
- Custom domain configured in Supabase
- Environment variables properly set

## Environment Variables

Create or update your `.env.local` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://zlvdzhzruabiktiidxpq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# For production, use service role key for OAuth callback
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## Supabase OAuth Configuration

### 1. Google OAuth Provider Setup

1. Go to your Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - **Client ID**: Your Google OAuth client ID
   - **Client Secret**: Your Google OAuth client secret
   - **Redirect URL**: `https://skcalapancityfederation.com/api/auth/callback`

### 2. Site URL Configuration

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL** to: `https://skcalapancityfederation.com`
3. Set **Redirect URLs** to include:
   - `https://skcalapancityfederation.com/auth/callback`
   - `https://skcalapancityfederation.com/api/auth/callback`

### 3. Custom Domain Configuration

1. Go to Supabase Dashboard → Settings → General
2. Add your custom domain: `skcalapancityfederation.com`
3. Configure DNS records as instructed by Supabase

## OAuth Flow Explanation

### Current Implementation

1. **User clicks Google Sign-In** → Redirects to Google OAuth
2. **Google redirects back** → To `/api/auth/callback` with authorization code
3. **API route exchanges code** → For session tokens using Supabase
4. **API redirects to frontend** → `/auth/callback` with session data
5. **Frontend processes session** → Creates/updates user in database
6. **User redirected to dashboard** → Authentication complete

### Fallback Flow (Direct OAuth)

If the API route fails, the frontend can handle direct OAuth redirects:
1. **User comes with tokens in URL hash** → `#access_token=...`
2. **Frontend extracts tokens** → From URL hash
3. **Frontend sets session** → Using `supabase.auth.setSession()`
4. **Process user data** → Same as normal flow

## Database Schema Requirements

Your `users` table must have these columns:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  user_role TEXT NOT NULL DEFAULT 'user',
  password TEXT NOT NULL,
  photo_url TEXT,
  phone TEXT,
  barangay TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Security Considerations

### 1. Service Role Key

- Use `SUPABASE_SERVICE_ROLE_KEY` for OAuth callback API route
- This key has elevated permissions and should be kept secure
- Never expose this key in client-side code

### 2. Token Validation

- All OAuth tokens are validated by Supabase
- Access tokens are short-lived and automatically refreshed
- Refresh tokens are securely stored by Supabase client

### 3. User Data Protection

- User passwords are never stored for OAuth users
- OAuth users get a placeholder password: `google_oauth_user`
- User metadata is extracted from Google OAuth response

## Testing the OAuth Flow

### 1. Test Google Sign-In

1. Navigate to your login page
2. Click "Sign in with Google"
3. Complete Google OAuth flow
4. Verify redirect to `/auth/callback`
5. Check browser console for logs
6. Verify user creation in database
7. Confirm redirect to dashboard

### 2. Debug Common Issues

#### Issue: "No code parameter found"
- **Cause**: OAuth redirect URL mismatch
- **Solution**: Check Supabase redirect URL configuration

#### Issue: "Failed to set session"
- **Cause**: Invalid or expired tokens
- **Solution**: Check token extraction and Supabase client configuration

#### Issue: "User creation failed"
- **Cause**: Database schema mismatch or permissions
- **Solution**: Verify table structure and RLS policies

#### Issue: "No active session found"
- **Cause**: Session not properly established
- **Solution**: Check OAuth flow and token exchange

## Monitoring and Logs

### Console Logs

The OAuth flow provides detailed logging:
- 🔗 API Route calls
- 📋 Parameter processing
- 🔑 Token extraction
- ✅ Success confirmations
- ❌ Error details

### Database Monitoring

Monitor your `users` table for:
- New user creation
- User updates from OAuth
- Duplicate prevention

## Production Deployment

### 1. Environment Variables

Ensure all environment variables are set in production:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 2. Domain Configuration

Verify your custom domain is properly configured:
- DNS records point to correct servers
- SSL certificates are valid
- Supabase custom domain is active

### 3. Error Handling

The implementation includes comprehensive error handling:
- Network failures
- Database errors
- Invalid tokens
- User creation failures

## Troubleshooting

### Common Error Messages

1. **"Authentication error. Please try signing in again."**
   - Check Supabase connection
   - Verify environment variables

2. **"Failed to process user session"**
   - Check database permissions
   - Verify table schema

3. **"OAuth processing failed"**
   - Check OAuth provider configuration
   - Verify redirect URLs

### Debug Steps

1. Check browser console for detailed logs
2. Verify Supabase dashboard for OAuth configuration
3. Test database connection and permissions
4. Check environment variables
5. Verify custom domain configuration

## Support

If you continue to experience issues:

1. Check Supabase logs in dashboard
2. Review browser console for error details
3. Verify all configuration steps above
4. Check database permissions and schema
5. Test with a fresh OAuth flow
