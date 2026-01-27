# MindFlex

## Overview

MindFlex is a responsive web application designed to support ADHD patients in managing daily tasks through playful activities, relaxation tools, and progress tracking. The platform provides:

- **Task Management**: Daily structured tasks organized by morning, afternoon, and evening categories
- **Brain Games**: Mini-games (reaction tapper, memory match, sudoku) to redirect attention and improve focus
- **Wellness Tools**: Yoga content, meditation guidance, and relaxation music playlists
- **AI Chatbot**: Supportive, non-clinical chat for stress reduction and thought reframing
- **Face Analysis**: Webcam-based assessment to detect fatigue, stress, or exhaustion using facial cues
- **Mood Tracking**: Daily mood logging with emoji-based input
- **Gamification**: Points, badges, and streak tracking for motivation
- **Health Data Integration**: Support for importing smartwatch data (steps, sleep, heart rate)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, built using Vite

**Routing**: Wouter for lightweight client-side routing

**State Management**: TanStack React Query for server state with custom hooks per domain (use-tasks, use-mood, use-auth, etc.)

**UI Components**: 
- Shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling with custom calming color palette (blues, greens, purples)
- Framer Motion for animations (breathing exercises, page transitions)
- Recharts for health data visualization

**Typography**: 
- "DM Sans" for body text (readability)
- "Outfit" for headings
- "Architects Daughter" for playful hand-written accents

**Key Client Structure**:
- `/client/src/pages/` - Page components (Dashboard, Tasks, Games, Chat, Wellness)
- `/client/src/components/` - Reusable components (DashboardLayout, TaskCard, MoodTracker)
- `/client/src/hooks/` - Custom React hooks for data fetching
- `/client/src/lib/` - Utilities (queryClient, utils)

### Backend Architecture

**Framework**: Express.js with TypeScript, running on Node.js

**API Design**: RESTful API with typed routes defined in `/shared/routes.ts` using Zod for validation

**Database**: PostgreSQL with Drizzle ORM
- Schema defined in `/shared/schema.ts`
- Migrations stored in `/migrations/`
- Connection pooling via `pg` package

**Authentication**: Replit Auth (OpenID Connect)
- Session storage in PostgreSQL (`sessions` table)
- Passport.js integration with custom storage adapter

**AI Integrations** (via Replit AI):
- OpenAI for chat completions
- Voice/audio processing with PCM16 streaming
- Image generation capabilities

**Key Server Structure**:
- `/server/routes.ts` - Main API route registration
- `/server/storage.ts` - Database operations layer
- `/server/replit_integrations/` - Replit-specific integrations (auth, chat, audio, image)

### Data Storage

**Primary Database**: PostgreSQL

**Tables**:
- `users` - User profiles from Replit Auth
- `sessions` - Session storage for authentication
- `tasks` - Daily tasks with categories and completion status
- `mood_logs` - Mood tracking entries with tags
- `assessments` - Webcam and questionnaire assessment results
- `health_data` - Imported smartwatch metrics
- `badges` - Achievement definitions
- `user_badges` - User-earned badges
- `conversations` / `messages` - Chat history

### Build System

**Development**: `tsx` for TypeScript execution with Vite dev server
**Production**: 
- Vite builds client to `/dist/public/`
- esbuild bundles server to `/dist/index.cjs`
- Key dependencies bundled to reduce cold start times

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable

### Authentication
- **Replit Auth**: OpenID Connect authentication via `ISSUER_URL`
- **Session Secret**: `SESSION_SECRET` environment variable required

### AI Services (Replit AI Integrations)
- **OpenAI API**: Chat, voice, and image generation
  - `AI_INTEGRATIONS_OPENAI_API_KEY`
  - `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Audio Processing
- **FFmpeg**: Required for audio format conversion (WebM to WAV for speech-to-text)

### Frontend Libraries
- **Unsplash**: External images used for landing page artwork
- **Google Fonts**: Architects Daughter, DM Sans, Outfit font families