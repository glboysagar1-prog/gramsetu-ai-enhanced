# GramSetu AI - Environment Setup Guide

This guide will help you properly set up your development environment for the GramSetu AI project.

## Prerequisites

Before setting up the environment, ensure you have the following installed:
- Node.js (v16 or higher)
- Python 3.8 or higher
- PostgreSQL client tools
- Git

## Environment Configuration

### 1. Environment Variables

The project requires several environment variables to be set. These have been added to your `.env` file:

```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:Jam@#123@#$@db.jbbohwklwzrxgscasycy.supabase.co:5432/postgres

# Authentication
JWT_SECRET=4ce3ad54f028e0964fdbe45a8039d07e29e77b655f8730cd79846007ee09fd41



# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=us-east1-gcp
PINECONE_INDEX=gramsetu-index

# Application Configuration
PORT=5000
NODE_ENV=development
REACT_APP_INSFORGE_URL=https://89gp4et3.us-east.insforge.app
```

### 2. Frontend Setup

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Verify environment setup:
   ```bash
   npm run setup:env
   ```

### 3. Backend Setup

1. Navigate to the services directory:
   ```bash
   cd services
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Verify Python environment:
   ```bash
   ./../scripts/setup-python-env.sh
   ```

### 4. Starting the Application

The application consists of three main services:

1. **Authentication Backend** (Node.js):
   ```bash
   cd replit-backend
   npm run dev
   ```

2. **Complaint Backend** (Python):
   ```bash
   cd services
   python app.py
   ```

3. **Frontend** (React):
   ```bash
   npm start
   ```

### 5. Verification

After starting all services, you can verify the setup by:

1. Checking the health endpoints:
   - Auth Backend: `http://localhost:5000/healthz`
   - Complaint Backend: `http://localhost:5001/healthz`

2. Running the environment verification scripts:
   ```bash
   npm run setup:env
   ./scripts/setup-python-env.sh
   ```

## Troubleshooting

### Common Issues

1. **Port Conflicts**: If ports are already in use, modify the PORT variable in your `.env` file.

2. **Database Connection**: Ensure your DATABASE_URL is correct and the database is accessible.

3. **Missing Dependencies**: If you encounter module not found errors, install the missing packages:
   ```bash
   npm install <package-name>
   # or for Python
   pip install <package-name>
   ```

4. **Environment Variables Not Loading**: Ensure the `.env` file is in the root directory and properly formatted.

### Service Status

You can check if services are running properly:

1. **Frontend**: Should be accessible at `http://localhost:3000`
2. **Auth Backend**: Should be accessible at `http://localhost:5000`
3. **Complaint Backend**: Should be accessible at `http://localhost:5001`

## Next Steps

After successful environment setup:

1. Create a demo user account
2. Test the voice complaint feature
3. Explore the AI governance assistant
4. Review the dashboard analytics

For detailed feature documentation, refer to the `README.md` and `PROJECT_OVERVIEW.md` files.