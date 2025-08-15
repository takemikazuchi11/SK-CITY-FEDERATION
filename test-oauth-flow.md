# OAuth Flow Testing Guide

Use this guide to test and verify that your Google OAuth integration is working correctly.

## Pre-Test Checklist

Before testing, ensure you have:

- [ ] Google OAuth provider enabled in Supabase
- [ ] Correct redirect URLs configured
- [ ] Environment variables set
- [ ] Database permissions configured
- [ ] RLS policies applied

## Test 1: Basic OAuth Flow

### Steps:
1. **Clear browser data** (cookies, localStorage, sessionStorage)
2. **Navigate to login page** (`/login`)
3. **Click "Sign in with Google"**
4. **Complete Google OAuth** (select account, grant permissions)
5. **Check redirect URL** - should go to `/api/auth/callback`
6. **Check final redirect** - should go to `/auth/callback`
7. **Verify user creation** - check database and console logs
8. **Confirm dashboard redirect** - should go to `/dashboard`

### Expected Console Logs:
```
🔗 API Route: /api/auth/callback called
📋 Search params: { code: '***', next: '/dashboard' }
✅ Code parameter found, exchanging for session...
✅ Session obtained successfully
👤 User email: user@example.com
📊 User metadata: {...}
🔄 Redirecting to: https://skcalapancityfederation.com/auth/callback?session=...
📋 Session data found in URL params
✅ Parsed session data: {...}
🔍 Processing user session for: user@example.com
🆕 User not found in database, creating new user
✅ User created successfully: {...}
💾 Storing user profile: {...}
📡 Dispatching userLogin event...
✅ User profile stored and event dispatched
🔄 Redirecting to dashboard in 1000ms...
```

## Test 2: Returning User Flow

### Steps:
1. **Sign out** from the application
2. **Sign in again** with the same Google account
3. **Check console logs** for user update logic
4. **Verify no duplicate users** in database

### Expected Console Logs:
```
✅ User exists in database: {...}
💾 Storing user profile: {...}
📡 Dispatching userLogin event...
✅ User profile stored and event dispatched
```

## Test 3: Direct OAuth Redirect (Fallback)

### Steps:
1. **Modify OAuth redirect URL** temporarily to point directly to frontend
2. **Sign in with Google**
3. **Check if frontend handles tokens** from URL hash
4. **Verify session establishment**

### Expected Console Logs:
```
🔑 Access token found in URL hash
🔑 Tokens extracted from URL hash
✅ Session established from OAuth tokens
🔍 Processing user session for: user@example.com
```

## Test 4: Error Handling

### Test Invalid Code:
1. **Manually navigate** to `/api/auth/callback?code=invalid`
2. **Check error response** and redirect

### Test Missing Code:
1. **Manually navigate** to `/api/auth/callback`
2. **Check error response** and redirect

### Expected Error Handling:
- Proper error messages displayed
- Redirect to login page with error parameters
- Console logs show detailed error information

## Test 5: Database Integration

### Check User Creation:
1. **Sign in with new Google account**
2. **Check Supabase dashboard** → Table Editor → users
3. **Verify user record** has correct data:
   - `id` matches Supabase auth user ID
   - `email` is correct
   - `first_name` and `last_name` extracted from Google
   - `photo_url` contains Google profile picture
   - `user_role` is set to "user"
   - `password` is "google_oauth_user"

### Check User Updates:
1. **Sign in with existing account**
2. **Check if user data** is updated with latest Google info
3. **Verify no duplicate records** created

## Test 6: Session Management

### Check Session Persistence:
1. **Sign in successfully**
2. **Refresh the page**
3. **Check if user remains signed in**
4. **Verify localStorage** contains user data

### Check Session Cleanup:
1. **Sign out**
2. **Check if localStorage** is cleared
3. **Verify redirect** to login page

## Test 7: Cross-Browser Testing

### Test in Different Browsers:
- Chrome
- Firefox
- Safari
- Edge

### Test in Incognito/Private Mode:
- Verify OAuth flow works without existing sessions
- Check if user creation works properly

## Test 8: Mobile Testing

### Test on Mobile Devices:
- iOS Safari
- Android Chrome
- Verify responsive design
- Check OAuth flow on mobile

## Debugging Common Issues

### Issue: "No code parameter found"
**Debug Steps:**
1. Check Supabase OAuth provider configuration
2. Verify redirect URL matches exactly
3. Check browser network tab for redirects
4. Verify custom domain configuration

### Issue: "Failed to exchange code for session"
**Debug Steps:**
1. Check environment variables
2. Verify Supabase service role key
3. Check Supabase logs in dashboard
4. Verify OAuth provider is enabled

### Issue: "User creation failed"
**Debug Steps:**
1. Check database schema
2. Verify RLS policies
3. Check user permissions
4. Verify table structure

### Issue: "Session not established"
**Debug Steps:**
1. Check token extraction
2. Verify Supabase client configuration
3. Check browser console for errors
4. Verify auth context integration

## Performance Testing

### Load Testing:
1. **Multiple simultaneous sign-ins**
2. **Check database performance**
3. **Monitor API response times**
4. **Verify no memory leaks**

### Stress Testing:
1. **Rapid sign-in/sign-out cycles**
2. **Check error handling under load**
3. **Verify graceful degradation**

## Security Testing

### Token Security:
1. **Check token expiration**
2. **Verify secure token storage**
3. **Test token refresh mechanism**

### Data Protection:
1. **Verify user data isolation**
2. **Check RLS policy enforcement**
3. **Test unauthorized access attempts**

## Monitoring and Logs

### Console Logs:
- All OAuth steps are logged
- Error details are captured
- User actions are tracked

### Database Logs:
- User creation/updates logged
- Failed operations captured
- Performance metrics available

### Network Logs:
- OAuth redirects tracked
- API calls monitored
- Error responses logged

## Success Criteria

Your OAuth integration is working correctly when:

- [ ] Users can sign in with Google
- [ ] New users are created in database
- [ ] Existing users are updated properly
- [ ] No duplicate users are created
- [ ] Sessions are established correctly
- [ ] Users are redirected to dashboard
- [ ] Error handling works properly
- [ ] Security policies are enforced
- [ ] Performance is acceptable
- [ ] Cross-browser compatibility works

## Next Steps

After successful testing:

1. **Monitor production usage**
2. **Set up error alerting**
3. **Implement user analytics**
4. **Plan for additional OAuth providers**
5. **Consider implementing SSO**
