# Quick Setup Guide for GramSetu AI Backend

## Step-by-Step Setup on Replit

### 1. Get Supabase Credentials

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in or create an account
3. Create a new project (or use existing)
4. Go to **Project Settings** (gear icon) → **API**
5. Copy these three values:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_KEY`

### 2. Create Supabase Storage Bucket

1. In Supabase dashboard, go to **Storage** (left sidebar)
2. Click **New bucket**
3. Name: `user-files`
4. Make it **Private**
5. Click **Create bucket**

### 3. Add Secrets to Replit

1. In Replit, click the **lock icon** (Secrets) in left sidebar
2. Add these three secrets:
   ```
   SUPABASE_URL = https://your-project.supabase.co
   SUPABASE_ANON_KEY = your-anon-key-here
   SUPABASE_SERVICE_KEY = your-service-role-key-here
   ```
3. Replit automatically provides `DATABASE_URL` (no action needed)

### 4. Set up Database Tables

Run this command in the Shell:
```bash
npm run db:push --force
```

This creates the `users` and `files` tables in your database.

### 5. Run the Application

Click the **Run** button (or it may auto-run). The server will start on port 5000.

### 6. Test the API

Use the live URL provided by Replit (shown in the Webview pane):
```
https://your-repl-name.your-username.repl.co
```

Test endpoints:
- POST `/api/auth/signup` - Create an account
- POST `/api/auth/login` - Login and get JWT token
- GET `/api/analytics?dummy=true` - View analytics (use token in Authorization header)

## Common Issues

### "The related resource does not exist"
- Make sure you created the `user-files` bucket in Supabase Storage

### "Database not available"
- Run `npm run db:push --force` to create database tables
- Check that DATABASE_URL is set (Replit sets this automatically)

### "Invalid credentials" on login
- Make sure you're using the same email you signed up with
- Check that Supabase credentials are correct

## Next Steps

1. **Test all endpoints** using the included `test-api.sh` script
2. **Deploy to production** - Click the Replit Deployments tab to publish
3. **Secure your API** - Update CORS settings in production
4. **Monitor usage** - Check Supabase dashboard for auth and storage stats

## API Documentation

See [README.md](README.md) for complete API documentation including:
- All endpoint details and examples
- Request/response formats
- Error handling
- Authentication flow
- File upload process
