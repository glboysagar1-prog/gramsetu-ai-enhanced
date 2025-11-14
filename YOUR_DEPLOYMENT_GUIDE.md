# 🚀 Your GramSetu AI - Railway Deployment Guide

This guide will help you deploy your GramSetu AI application to Railway with both backends and the frontend.

## 📋 Prerequisites

1. **Railway Account**: Create an account at [https://railway.app](https://railway.app)
2. **GitHub Account**: For connecting your repository
3. **Supabase Account**: For authentication and storage (you already have this)

## 🔧 Step-by-Step Deployment

### Step 1: Login to Railway

```bash
railway login
```

This will open a browser window for you to authenticate.

### Step 2: Deploy the Flask Backend (Main API)

1. From the project root directory:
```bash
railway init
```

2. Choose a name for your Flask backend (e.g., "gramsetu-flask-api")

3. Deploy the Flask backend:
```bash
railway up
```

4. Get your Flask backend URL:
```bash
railway url
```

### Step 3: Deploy the Replit Backend (Auth API)

1. Navigate to the Replit backend directory:
```bash
cd replit-backend
```

2. Initialize a new Railway project:
```bash
railway init
```

3. Choose a name for your Replit backend (e.g., "gramsetu-auth-api")

4. Deploy the Replit backend:
```bash
railway up
```

5. Get your Replit backend URL:
```bash
railway url
```

### Step 4: Configure Environment Variables

For each service, you'll need to add environment variables in the Railway dashboard:

#### Flask Backend Environment Variables:
- `PORT`: 5000
- `DATABASE_URL`: (Railway will provide this automatically with PostgreSQL addon)
- `REDIS_URL`: (Railway will provide this automatically with Redis addon)
- `JWT_SECRET`: your-super-secret-jwt-key-change-in-production
- `OPENAI_API_KEY`: (optional, for AI features)
- `THIRDWEB_API_KEY`: (optional, for blockchain features)

#### Replit Backend Environment Variables:
- `PORT`: 5000
- `NODE_ENV`: production
- `SUPABASE_URL`: your-supabase-url
- `SUPABASE_ANON_KEY`: your-anon-key
- `SUPABASE_SERVICE_KEY`: your-service-key
- `DATABASE_URL`: postgresql://...
- `JWT_SECRET`: your-super-secret-jwt-key-change-in-production

### Step 5: Add Database Addons

In the Railway dashboard for each project:

1. Click on "Addons"
2. Add "PostgreSQL" database
3. Add "Redis" cache (optional but recommended)

### Step 6: Run Migrations

For the Replit backend, you need to run database migrations:

```bash
cd replit-backend
railway run npm run db:push
```

### Step 7: Deploy the Frontend

For the React frontend, you have two options:

#### Option A: Deploy to Vercel (Recommended for Frontend)
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Set environment variables in Vercel dashboard:
- `REACT_APP_API_URL`: Your Flask backend URL
- `REACT_APP_AUTH_API_URL`: Your Replit backend URL

#### Option B: Deploy to Railway as Static Site
1. Build the frontend:
```bash
npm run build
```

2. Create a new Railway project and deploy the build folder.

## 🔗 Connecting the Services

After deployment, you'll have three URLs:
1. Flask Backend: `https://your-flask-project.up.railway.app`
2. Replit Backend: `https://your-replit-project.up.railway.app`
3. Frontend: `https://your-frontend.vercel.app` or Railway URL

Update your frontend to use these URLs in the environment variables.

## 🔄 Post-Deployment Steps

1. **Test Authentication**: Try logging in with demo credentials
2. **Test File Upload**: Upload a test file to the Replit backend
3. **Test Complaint Submission**: Submit a test complaint to the Flask backend
4. **Verify Analytics**: Check that analytics are working
5. **Test Export Features**: Try exporting PDF/Excel reports

## 🛠️ Troubleshooting

### Common Issues:

1. **Database Connection Errors**:
   - Ensure DATABASE_URL is correctly set
   - Check that PostgreSQL addon is provisioned

2. **Authentication Issues**:
   - Verify SUPABASE credentials are correct
   - Check JWT_SECRET matches between services

3. **CORS Errors**:
   - Add your frontend URL to allowed origins in both backends
   - Check Railway proxy settings

4. **File Upload Issues**:
   - Check storage bucket permissions in Supabase
   - Verify file size limits

## 💡 Tips for Success

1. **Start with Flask Backend**: Deploy the main API first
2. **Test Each Service**: Verify each backend works independently
3. **Use Demo Mode**: Start with fallback/demo mode before enabling AI features
4. **Monitor Logs**: Use `railway logs` to troubleshoot issues
5. **Set Up Alerts**: Configure Railway health checks and notifications

## 📊 Monitoring Your Deployment

- Use Railway's built-in monitoring dashboard
- Set up custom domains if needed
- Configure SSL certificates (Railway provides automatically)
- Set up performance alerts

## 🆘 Support

If you encounter issues:
1. Check the Railway documentation
2. Review application logs with `railway logs`
3. Verify environment variables are correctly set
4. Ensure all dependencies are properly installed

Your GramSetu AI application is now ready for production deployment!