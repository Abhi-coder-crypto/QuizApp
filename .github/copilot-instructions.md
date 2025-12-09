# Copilot Instructions for NAPCON Quiz App

## Architecture Overview

**NAPCON Quiz** is a full-stack medical quiz application with two independently deployable services:

- **Client** (`client/`): React 18 SPA handling login, quiz UI, and result display
- **Server** (`server/`): Express.js REST API with JWT auth and MongoDB data persistence

**Data Flow**: LoginForm → `/api/auth/login` (upsert user) → JWT token to localStorage → QuizPage fetches `/api/quiz/questions` (protected) → submit answers to `/api/quiz/submit` → score calculation and storage → ResultPage displays score.

## Key Patterns & Conventions

### Authentication & Authorization
- **JWT-based**: `server/routes/quiz.js` uses `authMiddleware` to verify Bearer tokens from `Authorization` header
- **Token Storage**: Client stores JWT in `localStorage` via `setToken()` in `client/src/api.js`
- **User Upsert Logic**: `/api/auth/login` creates new user or updates existing user profile by email (`server/routes/auth.js` lines 17-44)
- **Credential Requirements**: Only `doctorName` and `email` are mandatory; other fields optional

### Scoring Rules (Critical Business Logic)
- **Per Question**: +2 for correct answer, -1 for incorrect (source: `server/routes/quiz.js` line 80-81)
- **Total Quiz Value**: 30 questions × 2 points = 60 maximum
- **Submission Format**: POST `/api/quiz/submit` with array of `{ questionIndex, answerIndex }` objects
- **Result Persistence**: Scores stored in user document within `scores` array (MongoDB schema: `server/models/User.js`)

### API Patterns
- **Base URL**: Hardcoded as `http://localhost:5000` in `client/src/api.js` (line 1) — update for production
- **Content-Type**: All POST requests use `'Content-Type': 'application/json'`
- **Error Handling**: Responses use simple JSON format `{ message: '...', token?, user?, score? }` — no standardized error codes

### Data Model
- **User Schema** (`server/models/User.js`): Stores doctor profile + score history
  - Profile fields: `doctorName`, `email` (unique), `qualification`, `phoneNumber`, `collegeFullName`, `state`, `city`, `pincode`, `attendPhysicalNAPCON`
  - Scores array with date tracking and raw answer storage (NB: schema uses `answers` but submission uses `rawAnswers`)
- **Questions**: Hardcoded in `server/routes/quiz.js` (30 medical board exam questions) — no database queries

### Component Lifecycle (React)
- **App.js**: Manages three-stage state machine: `login` → `quiz` → `result`
- **LoginForm.js**: Collects doctor profile, calls `login()`, stores token, triggers stage transition
- **QuizPage.js**: Fetches questions on mount, handles answer selection, submits via `submitAnswers()`
- **ResultPage.js**: Displays final score and allows restart (clears token)

## Build & Run Commands

```bash
# Root workspace (runs both client and server)
npm run dev          # Start both with nodemon (server) + react-scripts (client)

# Client only
cd client && npm start    # PORT=3000, React dev server
cd client && npm build    # Production build to client/build/
cd client && npm test     # Jest test runner

# Server only
cd server && npm dev      # nodemon auto-restart on changes
cd server && npm start    # Production mode
```

**Environment Variables** (`.env` at project root):
- `PORT` (server, default 5000)
- `MONGO_URI` (required, exits if missing — line 18 of `server/server.js`)
- `JWT_SECRET` (default `'secret'`, change in production)

## Common Development Workflows

1. **Adding a Question**: Edit hardcoded array in `server/routes/quiz.js` lines 22-49 (follow existing object structure with `text`, `options`, `correctIndex`)
2. **Changing Scoring**: Modify multiplier/penalty in `server/routes/quiz.js` line 80-81
3. **Updating User Fields**: Edit both `User.js` schema AND LoginForm.js form state initialization
4. **Debugging Auth Issues**: Check `JWT_SECRET` consistency between auth.js (line 6) and quiz.js (line 8)
5. **Production API URL**: Replace `BASE_URL` in `client/src/api.js` line 1 with actual server domain

## Notable Quirks & Technical Debt

- **Questions are static**: No database or CMS — editing requires code change + redeploy
- **Token expiration**: Set to 7 days (`server/routes/auth.js` line 47) but client doesn't refresh
- **Score array schema mismatch**: User model expects `answers` (line 8, `server/models/User.js`) but route submits `rawAnswers` (line 82, `server/routes/quiz.js`) — this works due to loose schema but is confusing
- **CORS enabled for all origins** (`server/server.js` line 8) — restrict in production with `cors({ origin: 'https://...' })`
- **No input validation on profile fields** beyond email format (HTML5)
- **No logging beyond console** — add Winston/Pino for production

## Testing Considerations

- Client unit tests: `cd client && npm test` uses Jest + react-scripts
- No backend tests currently present — add `server/routes/__tests__/` with supertest
- Manual testing: Use Postman/curl to test `/api/auth/login` and `/api/quiz/submit` with mock Bearer tokens
