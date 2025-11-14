# GramSetu AI - Complete Backend Integration

This document describes the complete integration of both backend systems in the GramSetu AI project.

## System Architecture

The GramSetu AI system now consists of two complementary backend services:

### 1. Replit Backend (Port 5003)
- **Purpose**: Authentication, file storage, and user management
- **Technology**: Node.js/Express with TypeScript
- **Database**: Supabase PostgreSQL
- **API Base**: `http://localhost:5003/api`

### 2. Flask Backend (Port 5001)
- **Purpose**: Complaint management, AI processing, and analytics
- **Technology**: Python Flask
- **Database**: SQLite (local)
- **API Base**: `http://localhost:5001/api`

## API Endpoints

### Replit Backend Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

#### File Management
- `POST /api/files/upload` - Upload files (protected)
- `GET /api/files` - List user files (protected)
- `DELETE /api/files/:id` - Delete file (protected)

#### Analytics
- `GET /api/analytics` - User analytics (protected)

### Flask Backend Endpoints

#### Complaint Management
- `POST /api/v1/complaints` - Submit complaint
- `GET /api/v1/complaints` - List complaints
- `GET /api/v1/complaints/:id` - Get specific complaint

#### Citizen Management
- `GET /citizen/:citizen_id` - Get citizen information

#### Voice Services
- `POST /api/v1/voice/complaint` - Submit voice complaint
- `GET /api/v1/voice/languages` - Supported languages

#### Export Services
- `POST /api/export/pdf` - Export data as PDF
- `POST /api/export/excel` - Export data as Excel

## Starting the System

### Automated Startup
Run the integrated startup script:
```bash
./scripts/start-all.sh
```

This will:
1. Start the Replit backend on port 5003
2. Start the Flask backend on port 5001
3. Display status information and access URLs

### Manual Startup
1. **Start Replit Backend**:
   ```bash
   cd replit-backend
   npm run dev
   ```

2. **Start Flask Backend**:
   ```bash
   python3 app.py
   ```

## Testing the Integration

Run the test script to verify both backends are working:
```bash
./scripts/test-apis.sh
```

## Stopping the System

### Automated Shutdown
```bash
./scripts/stop-all.sh
```

### Manual Shutdown
Use Ctrl+C in the terminal windows running the servers.

## Authentication Flow

1. Register/Login through Replit backend
2. Receive JWT token
3. Use token for authenticated requests to both backends
4. File operations use Replit backend
5. Complaint operations use Flask backend

## Environment Configuration

Both backends require proper environment configuration:

### Replit Backend (.env)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Public API key
- `SUPABASE_SERVICE_KEY` - Service role key
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing

### Flask Backend (.env)
- Standard Flask configuration variables

## Data Flow

1. **User Authentication**: Handled by Replit backend
2. **File Storage**: Managed by Replit backend with Supabase
3. **Complaint Processing**: Handled by Flask backend with AI features
4. **Analytics**: Available from both backends
5. **Export Services**: Provided by Flask backend

## Troubleshooting

### Port Conflicts
If ports are in use:
```bash
# Check what's using the ports
lsof -ti:5001
lsof -ti:5003

# Kill processes
kill -9 $(lsof -ti:5001)
kill -9 $(lsof -ti:5003)
```

### Database Issues
- Ensure Supabase credentials are correct in `.env`
- Run setup scripts: `node setup-storage.js`
- Push database schema: `npm run db:push`

### API Testing
Use curl or Postman to test endpoints:
```bash
# Test login
curl -X POST http://localhost:5003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123456"}'

# Test health check
curl http://localhost:5001/healthz
```

## Logs

Check logs for debugging:
- `logs/replit-backend.log` - Replit backend logs
- `logs/flask-backend.log` - Flask backend logs
- `gramsetu.log` - Main application logs

## Next Steps

1. Start both backends using `./scripts/start-all.sh`
2. Access the frontend at `http://localhost:3000`
3. Use the integrated system for full functionality
4. Monitor logs for any issues

The system is now fully integrated and ready for production use!