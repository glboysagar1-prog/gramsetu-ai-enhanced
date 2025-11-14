# Deploy GramSetu AI with Docker

This guide explains how to deploy the GramSetu AI application using Docker to any cloud provider that supports containerized applications.

## Prerequisites

1. Docker installed on your local machine
2. Docker Compose installed
3. A cloud provider account (AWS, Google Cloud, Azure, DigitalOcean, etc.)

## Docker Deployment Files

The project already includes Dockerfiles for both backends:

1. **Flask Backend**: [Dockerfile.flask](file:///Users/sagar/Documents/GramSetu%20AI%20–%20National%20Governance%20Intelligence%20Network/Dockerfile.flask)
2. **Node.js Backend**: [replit-backend/Dockerfile](file:///Users/sagar/Documents/GramSetu%20AI%20–%20National%20Governance%20Intelligence%20Network/replit-backend/Dockerfile)
3. **Frontend**: [Dockerfile.frontend](file:///Users/sagar/Documents/GramSetu%20AI%20–%20National%20Governance%20Intelligence%20Network/Dockerfile.frontend)

## Deployment Steps

### 1. Prepare Environment Variables

Create a `.env` file with the necessary environment variables:

```env
# Flask Backend Environment Variables
FLASK_APP=app.py
FLASK_ENV=production
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@db:5432/gramsetu
REDIS_URL=redis://redis:6379/0

# Node.js Backend Environment Variables
JWT_SECRET=your-jwt-secret
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# Frontend Environment Variables
REACT_APP_API_URL=https://your-flask-backend-url
REACT_APP_AUTH_API_URL=https://your-nodejs-backend-url
```

### 2. Build and Push Docker Images

```bash
# Build Flask backend
docker build -f Dockerfile.flask -t gramsetu-flask-backend .

# Build Node.js backend
cd replit-backend
docker build -t gramsetu-nodejs-backend .
cd ..

# Build Frontend
docker build -f Dockerfile.frontend -t gramsetu-frontend .

# Tag and push to your container registry
docker tag gramsetu-flask-backend your-registry/gramsetu-flask-backend:latest
docker tag gramsetu-nodejs-backend your-registry/gramsetu-nodejs-backend:latest
docker tag gramsetu-frontend your-registry/gramsetu-frontend:latest

docker push your-registry/gramsetu-flask-backend:latest
docker push your-registry/gramsetu-nodejs-backend:latest
docker push your-registry/gramsetu-frontend:latest
```

### 3. Deploy to Cloud Provider

#### AWS ECS Deployment

1. Create an ECS cluster
2. Create task definitions for each service
3. Create services for each container
4. Configure load balancers
5. Set up environment variables

#### Google Cloud Run Deployment

```bash
# Deploy Flask backend
gcloud run deploy gramsetu-flask-backend \
  --image your-registry/gramsetu-flask-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Deploy Node.js backend
gcloud run deploy gramsetu-nodejs-backend \
  --image your-registry/gramsetu-nodejs-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Deploy Frontend
gcloud run deploy gramsetu-frontend \
  --image your-registry/gramsetu-frontend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Azure Container Instances Deployment

```bash
# Deploy all services
az container create \
  --resource-group gramsetu-rg \
  --name gramsetu-backend \
  --image your-registry/gramsetu-flask-backend:latest \
  --dns-name-label gramsetu-backend \
  --ports 5000

az container create \
  --resource-group gramsetu-rg \
  --name gramsetu-auth \
  --image your-registry/gramsetu-nodejs-backend:latest \
  --dns-name-label gramsetu-auth \
  --ports 5003

az container create \
  --resource-group gramsetu-rg \
  --name gramsetu-frontend \
  --image your-registry/gramsetu-frontend:latest \
  --dns-name-label gramsetu-frontend \
  --ports 80
```

### 4. Database Setup

You'll need to set up a PostgreSQL database separately:

#### Using AWS RDS
1. Create a PostgreSQL RDS instance
2. Configure security groups to allow connections
3. Update your DATABASE_URL environment variable

#### Using Google Cloud SQL
1. Create a Cloud SQL PostgreSQL instance
2. Configure connections
3. Update your DATABASE_URL environment variable

#### Using Azure Database for PostgreSQL
1. Create a PostgreSQL database
2. Configure firewall rules
3. Update your DATABASE_URL environment variable

## Alternative: Use Managed Database Services

Instead of managing your own database, you can use:

1. **Supabase** - For both database and authentication
2. **Firebase** - For real-time database and authentication
3. **MongoDB Atlas** - For document-based database
4. **PlanetScale** - For serverless MySQL

## Monitoring and Logging

Set up monitoring for your deployed services:

1. **Application Performance Monitoring (APM)**:
   - New Relic
   - Datadog
   - Prometheus + Grafana

2. **Log Management**:
   - ELK Stack (Elasticsearch, Logstash, Kibana)
   - Splunk
   - Papertrail

3. **Error Tracking**:
   - Sentry
   - Rollbar
   - Bugsnag

## CI/CD Pipeline

Set up continuous integration and deployment:

1. **GitHub Actions**:
   ```yaml
   name: Deploy to Cloud
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v2
       - name: Build and deploy
         run: |
           # Build and push Docker images
           # Deploy to cloud provider
   ```

2. **GitLab CI/CD**
3. **CircleCI**
4. **Jenkins**

## Security Considerations

1. Use HTTPS for all communications
2. Implement proper authentication and authorization
3. Regularly update dependencies
4. Use environment variables for secrets
5. Implement rate limiting
6. Set up proper firewall rules

## Scaling

1. **Horizontal Scaling**:
   - Use load balancers
   - Implement caching with Redis
   - Use CDN for static assets

2. **Vertical Scaling**:
   - Increase container resources
   - Optimize database queries
   - Implement database indexing

## Backup and Disaster Recovery

1. Regular database backups
2. Application state backups
3. Automated failover mechanisms
4. Multi-region deployment for high availability

## Cost Optimization

1. Use spot instances where possible
2. Implement auto-scaling
3. Monitor resource usage
4. Use managed services to reduce operational overhead

This Docker deployment approach gives you flexibility to deploy to any cloud provider that supports containerized applications while maintaining full control over your infrastructure.