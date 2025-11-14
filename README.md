# GramSetu AI - National Governance Intelligence Network

## Overview

GramSetu AI is a comprehensive governance platform that leverages artificial intelligence, blockchain technology, and data analytics to revolutionize citizen engagement with government services. The platform enables citizens to file complaints, track their resolution, and interact with an AI-powered governance assistant, while providing government officials with powerful analytics and management tools.

## Key Features

### 🤖 AI-Powered Governance Assistant
- Natural language processing for citizen queries
- Policy information retrieval using Google Gemini AI
- Multilingual support for India's diverse linguistic landscape
- Context-aware responses based on citizen profiles and complaint history

### 📢 Smart Complaint Management
- Multi-channel complaint submission (web, mobile, voice)
- Real-time tracking and status updates
- Automated categorization and routing
- Escalation mechanisms for unresolved issues
- Blockchain-based immutable audit trail

### 🎯 Role-Based Dashboards
- **Citizen Dashboard**: Personal complaint tracking, AI chat, reputation score
- **Field Officer Dashboard**: Complaint assignment, resolution tracking, performance metrics
- **District Officer Dashboard**: District-wide analytics, officer management, resource allocation
- **State Officer Dashboard**: State-level insights, policy impact analysis, cross-district coordination
- **National Admin Dashboard**: Pan-India overview, system health monitoring, policy formulation support

### 🔊 Voice Complaint System
- Support for 11 Indian languages (Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, and English)
- Automatic language detection
- Configurable Whisper models for transcription accuracy vs. speed
- Audio preprocessing for noise reduction

### 📊 Advanced Analytics & Visualization
- Real-time complaint heatmaps
- Trend analysis with predictive modeling
- Performance metrics for government officials
- Resource allocation optimization
- Policy impact assessment tools

### 🔐 Robust Authentication System
- JWT-based authentication with role-based access control
- Google OAuth integration for single sign-on
- Password reset with OTP verification
- Multi-role support with hierarchical permissions
- Secure session management

### 🛡️ Blockchain Integration
- Immutable complaint logging on Polygon network
- Transparent audit trail for all actions
- Tamper-proof evidence storage
- Smart contracts for automated workflows

### 📱 Responsive Design
- Mobile-first approach for maximum accessibility
- Progressive Web App (PWA) capabilities
- Offline mode with cached data synchronization
- Adaptive layouts for all device sizes

## Technology Stack

### Frontend
- React 18.2 with React Router v6
- Three.js for 3D visualizations
- Recharts and Chart.js for data visualization
- Tailwind CSS for responsive design
- Framer Motion for smooth animations

### Backend
- **Complaint Backend**: Python Flask with Gunicorn
- **Auth Backend**: Node.js Express with TypeScript
- RESTful API architecture
- PostgreSQL database with PostGIS for geospatial data
- Redis for caching and session management

### AI & Machine Learning
- Google Gemini AI for natural language processing
- LangChain for RAG implementation
- Pinecone vector database for semantic search
- OpenAI Whisper for voice transcription
- Hugging Face models for multilingual classification
- TensorFlow.js for client-side inference

### Infrastructure
- Docker for containerization
- Docker Compose for multi-service orchestration
- Nginx for reverse proxy and load balancing
- Railway for cloud deployment
- Vercel for frontend hosting
- GitHub Actions for CI/CD

## Google Gemini AI Integration

This project now includes integration with Google Gemini AI, providing advanced natural language understanding capabilities for the governance assistant. The integration uses the `gemini-2.0-flash-001` model for optimal performance.

## Authentication Features

The platform includes a comprehensive authentication system with:

1. **JWT Authentication**: Secure token-based authentication with automatic refresh
2. **Google OAuth**: Single Sign-On integration for seamless user experience
3. **Password Reset**: OTP-based password recovery system
4. **Role-Based Access Control**: Five distinct roles with hierarchical permissions
5. **User Registration**: Role-specific signup process with validation

For detailed information about the authentication system, see [AUTHENTICATION_FEATURES.md](AUTHENTICATION_FEATURES.md).

## Deployment Options

### Automated Deployment Scripts

1. **Quick Railway Deployment**:
   ```bash
   ./scripts/quick-deploy-railway.sh
   ```

2. **Full Stack Deployment (Railway + Vercel)**:
   ```bash
   ./scripts/deploy-full-stack.sh
   ```

3. **InsForge Integrated Deployment**:
   ```bash
   ./scripts/deploy-with-insforge.sh
   ```

### Manual Deployment

For detailed deployment instructions, see [DEPLOYMENT_INSTRUCTIONS.md](DEPLOYMENT_INSTRUCTIONS.md).

## Quick Start

### Prerequisites
- Node.js 16+
- Python 3.8+
- Docker and Docker Compose
- PostgreSQL 13+
- Redis 6+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/gramsetu-ai.git
cd gramsetu-ai
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd replit-backend
npm install
cd ../services
pip install -r requirements.txt
```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your API keys:
     - `REACT_APP_GEMINI_API_KEY` - Google Gemini API key
     - `OPENAI_API_KEY` - OpenAI API key (optional, for fallback)
     - Database and other service keys

5. Start the development servers:
```bash
# Terminal 1: Frontend
npm start

# Terminal 2: Auth Backend
cd replit-backend
npm run dev

# Terminal 3: Complaint Backend
cd services
python app.py
```

### Docker Deployment
```bash
docker-compose up --build
```

## Project Structure

```
gramsetu-ai/
├── src/                 # React frontend
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Utility functions
├── replit-backend/      # Node.js authentication backend
│   ├── client/          # Frontend for backend admin panel
│   ├── server/          # Express server with controllers/services
│   └── shared/          # Shared types and schemas
├── services/            # Python Flask complaint backend
├── public/              # Static assets
├── scripts/             # Automation scripts
└── docs/                # Documentation
```

## API Documentation

### Auth Backend API
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/password-reset/*` - Password reset workflows
- `GET /api/auth/profile` - Get user profile

### Complaint Backend API
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints` - List complaints
- `GET /api/complaints/:id` - Get specific complaint
- `PUT /api/complaints/:id` - Update complaint status
- `POST /api/voice/upload` - Upload voice complaint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google for Gemini AI capabilities
- OpenAI for Whisper speech recognition
- Hugging Face for multilingual models
- Polygon for blockchain infrastructure
- All contributors who have helped shape GramSetu AI

## Contact

For questions or support, please open an issue on GitHub or contact the development team.