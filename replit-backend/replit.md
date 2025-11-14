# GramSetu AI - File Management Platform

## Overview
GramSetu AI is a professional file management platform with analytics, built with Node.js, Express, PostgreSQL, and React. It provides secure authentication, file upload management with signed URLs, and comprehensive analytics dashboards.

## Project Architecture

### Backend (Node.js + Express + PostgreSQL)
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **API Endpoints**:
  - `POST /api/auth/signup` - User registration
  - `POST /api/auth/login` - User login with JWT token
  - `POST /api/files/upload` - Upload file metadata and generate signed URL
  - `GET /api/files` - Get user's files list
  - `DELETE /api/files/:id` - Delete a file
  - `GET /api/analytics` - Get analytics data

### Frontend (React + TypeScript + Tailwind CSS)
- **Pages**:
  - Login/Signup - Authentication forms
  - Dashboard - Overview with stats and recent activity
  - Files - File management with upload, search, and delete
  - Analytics - Data visualization with trends and distributions
  - Settings - User preferences and account info
- **Components**:
  - AppSidebar - Navigation sidebar
  - ThemeToggle - Dark/Light mode switch
  - Form components with validation

### Database Schema
- **users**: id, username, email, password, createdAt
- **files**: id, userId, filename, fileType, fileSize, uploadedAt, signedUrl

## Recent Changes
- Initial project setup with full-stack architecture
- Implemented JWT authentication system
- Created PostgreSQL database with users and files tables
- Built all frontend pages with Material Design principles
- Integrated analytics with real-time data aggregation
- Added dark mode support (default)

## User Preferences
- Default theme: Dark mode
- Color scheme: Purple primary (#7C3AED) for AI branding
- Typography: Inter for UI, JetBrains Mono for data
- Design approach: Clean, minimal, utility-focused

## Technical Stack
- **Backend**: Node.js 20, Express, PostgreSQL (Neon), Drizzle ORM
- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn UI
- **Authentication**: JWT with bcrypt
- **State Management**: TanStack Query v5
- **Routing**: Wouter
- **Forms**: React Hook Form + Zod validation

## Running the Project
- Start: `npm run dev` (runs both frontend and backend)
- Database migration: `npm run db:push`

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-configured)
- `JWT_SECRET` - Secret for JWT signing (defaults to dev key)
- `SESSION_SECRET` - Session secret (auto-configured)
