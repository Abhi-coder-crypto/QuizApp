# Quiz App

## Overview
A full-stack quiz application built with React frontend and Express.js backend using MongoDB for data storage.

## Project Structure
- `client/` - React frontend application (built with create-react-app)
  - `src/` - React source files
  - `build/` - Production build output
- `server/` - Express.js backend
  - `routes/` - API routes (auth, quiz)
  - `models/` - MongoDB models (User)
  - `server.js` - Main server entry point

## Tech Stack
- **Frontend**: React 18
- **Backend**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT tokens

## Running the App
The server runs on port 5000 and serves both the API endpoints and the built React frontend.

## API Endpoints
- `POST /api/auth/login` - User login
- `GET /api/quiz/questions` - Fetch quiz questions (requires auth)
- `POST /api/quiz/submit` - Submit quiz answers (requires auth)

## Environment Variables
- `MONGO_URI` - MongoDB connection string (required for full functionality)
- `PORT` - Server port (defaults to 5000)

## Recent Changes
- 2025-12-10: Configured for Replit environment
  - Updated client API to use relative URLs
  - Updated server to bind to 0.0.0.0
  - Made MongoDB connection optional for testing
