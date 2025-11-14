# GramSetu AI - Backend API

A professional Node.js + Express backend with Supabase integration for authentication and file storage.

## Features

- **JWT-based Authentication**: Secure user signup and login using Supabase Auth
- **File Management**: Upload files with signed URLs to Supabase Storage
- **Analytics Dashboard**: Get comprehensive file and storage analytics
- **Input Validation**: All endpoints validate inputs with descriptive error messages
- **Modular Architecture**: Clean separation with routes, controllers, and services
- **Production Ready**: Ready to deploy on Replit with live URL endpoint

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: PostgreSQL (via Supabase or Neon)
- **Authentication**: Supabase Auth with JWT tokens
- **File Storage**: Supabase Storage
- **Validation**: Zod schemas
- **ORM**: Drizzle ORM
- **Language**: TypeScript

## API Endpoints

### Authentication (Public)

#### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "username": "johndoe"
  }
}
```

#### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john@example.com",
    "username": "johndoe"
  }
}
```

### File Management (Protected)

All file endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

#### POST /api/files/upload
Generate a signed URL for file upload and save metadata.

**Request Body:**
```json
{
  "filename": "document.pdf",
  "fileType": "application/pdf",
  "fileSize": 2457600
}
```

**Response (201):**
```json
{
  "message": "Upload URL generated successfully",
  "uploadUrl": "https://xxx.supabase.co/storage/v1/object/upload/sign/user-files/...",
  "token": "upload-token-here",
  "path": "userid/timestamp_document.pdf",
  "file": {
    "id": "file-uuid",
    "filename": "document.pdf",
    "fileType": "application/pdf",
    "fileSize": 2457600,
    "uploadedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Usage:**
1. Call this endpoint to get a signed upload URL
2. Use the `uploadUrl` and `token` to upload your file to Supabase Storage
3. File metadata is automatically saved to the database

#### GET /api/files
Get all files for the authenticated user.

**Response (200):**
```json
{
  "message": "Files retrieved successfully",
  "files": [
    {
      "id": "file-uuid-1",
      "filename": "document.pdf",
      "fileType": "application/pdf",
      "fileSize": 2457600,
      "uploadedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "file-uuid-2",
      "filename": "image.png",
      "fileType": "image/png",
      "fileSize": 1048576,
      "uploadedAt": "2024-01-14T15:20:00.000Z"
    }
  ],
  "count": 2
}
```

#### DELETE /api/files/:id
Delete a specific file.

**Response (200):**
```json
{
  "message": "File deleted successfully"
}
```

### Analytics (Protected)

#### GET /api/analytics
Get comprehensive analytics for the authenticated user.

**Query Parameters:**
- `dummy=true` (optional): Return dummy data for testing/demo purposes

**Response (200):**
```json
{
  "message": "Analytics retrieved successfully",
  "data": {
    "totalFiles": 42,
    "totalStorage": 157286400,
    "filesThisMonth": 12,
    "storageThisMonth": 31457280,
    "recentUploads": [
      {
        "filename": "project_report.pdf",
        "uploadedAt": "2024-01-15T10:30:00.000Z",
        "fileSize": 2457600
      }
    ],
    "fileTypeDistribution": [
      { "type": "PDF", "count": 15 },
      { "type": "Images", "count": 18 },
      { "type": "Videos", "count": 5 }
    ],
    "uploadTrend": [
      { "date": "2024-01-09", "count": 3 },
      { "date": "2024-01-10", "count": 5 },
      { "date": "2024-01-11", "count": 2 }
    ]
  }
}
```

## Project Structure

```
server/
├── controllers/          # Request handlers
│   ├── authController.ts
│   ├── fileController.ts
│   └── analyticsController.ts
├── services/            # Business logic
│   ├── supabase.ts      # Supabase client configuration
│   ├── authService.ts   # Authentication logic
│   ├── fileService.ts   # File management logic
│   └── analyticsService.ts
├── middleware/          # Express middleware
│   └── supabaseAuth.ts  # JWT authentication
├── routes.ts           # API route definitions
├── storage.ts          # Database operations
├── db.ts              # Database connection
└── index.ts           # Server entry point

shared/
└── schema.ts          # Shared types and validation schemas
```

## Environment Variables

Create a `.env` file or use Replit Secrets with the following variables:

```bash
# Supabase Configuration (Required)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Database (Required for file metadata and analytics)
DATABASE_URL=postgresql://user:password@host:port/database

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Note**: While Supabase handles authentication and file storage, a PostgreSQL database (DATABASE_URL) is required to store file metadata and provide analytics functionality. You can use either:
- Replit's built-in PostgreSQL database (automatically provisioned)
- Supabase's PostgreSQL database
- Any other PostgreSQL database

### Getting Supabase Credentials

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project or select existing one
3. Go to **Project Settings** → **API**
4. Copy your **Project URL** (SUPABASE_URL)
5. Copy your **anon/public** key (SUPABASE_ANON_KEY)
6. Copy your **service_role** key (SUPABASE_SERVICE_KEY)

### Setting up Supabase Storage

**Important**: You must create the storage bucket before using file upload features.

1. In your Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Enter bucket name: `user-files`
4. Set the bucket to **Private** (recommended - files accessible only with signed URLs)
5. Click **Create bucket**

**Storage Policies (Optional but Recommended)**:
If you want additional security, you can configure Row Level Security (RLS) policies:
- Go to your bucket settings
- Add policies to restrict access based on user authentication
- The backend uses the service role key which bypasses RLS, so policies are optional for this setup

## Running Locally

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Supabase account with project created

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gramsetu-ai-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and add your Supabase credentials
```

4. Set up database schema:
```bash
# Push schema to your PostgreSQL database
npm run db:push

# If you encounter warnings, force the push
npm run db:push --force
```

**Note**: The database is required for storing file metadata and analytics. Make sure DATABASE_URL is set before running migrations.

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000` (or the port specified in PORT environment variable).

## Deployment on Replit

This project is ready to deploy on Replit:

1. **Fork/Import** this repository to Replit

2. **Add Secrets** (click the lock icon in the left sidebar):
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `SUPABASE_SERVICE_KEY` - Your Supabase service role key
   
   **Note**: Replit automatically provisions a PostgreSQL database and sets DATABASE_URL for you

3. **Set up Supabase Storage**:
   - Go to your Supabase dashboard → Storage
   - Create a new bucket named `user-files` (Private)
   
4. **Set up Database Tables**:
   ```bash
   npm run db:push --force
   ```

5. **Run the project** - Replit will automatically:
   - Install dependencies
   - Start the server
   - Provide a live URL (accessible via the Webview)

4. **Access your API**:
   - The API will be available at: `https://your-repl-name.your-username.repl.co`
   - Test endpoints using the provided URL

### Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in environment variables
2. Use strong, unique values for all secret keys
3. Enable CORS only for your frontend domain
4. Set up proper monitoring and logging
5. Configure rate limiting for API endpoints
6. Review and update Supabase security policies

## Testing the API

### Using cURL

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get files (replace TOKEN with your JWT)
curl http://localhost:5000/api/files \
  -H "Authorization: Bearer TOKEN"

# Upload file metadata
curl -X POST http://localhost:5000/api/files/upload \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "test.pdf",
    "fileType": "application/pdf",
    "fileSize": 1024000
  }'

# Get analytics with dummy data
curl http://localhost:5000/api/analytics?dummy=true \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman/Insomnia

1. Import the API endpoints
2. Create an environment with your base URL
3. Use the signup/login endpoints to get a token
4. Add the token to the Authorization header for protected endpoints

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message here",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created successfully
- `400`: Validation error or bad request
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Resource not found
- `409`: Conflict (duplicate resource)
- `500`: Internal server error

## Security Features

- **Password Hashing**: User passwords are never stored in plain text
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: All inputs validated with Zod schemas
- **SQL Injection Protection**: Drizzle ORM prevents SQL injection
- **CORS**: Configurable cross-origin resource sharing
- **Environment Variables**: Sensitive data stored securely

## Support

For issues or questions:
1. Check the error message for detailed information
2. Review the API documentation above
3. Check Supabase dashboard for storage/auth issues
4. Enable debug logging by setting `NODE_ENV=development`

## License

MIT License - feel free to use this project for your own purposes.
