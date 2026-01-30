# MindFlex Project Documentation

## Project Overview
MindFlex is a comprehensive ADHD support web application designed to help users manage daily tasks, improve focus through games, and track their wellness.

## Technical Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Express.js (Node.js), TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth
- **AI Integrations**: OpenAI (Chat, Voice, Image generation)

## Core Features
1. **Task Management**: Daily structured tasks (Morning, Afternoon, Evening).
2. **Brain Games**: Mini-games like Sudoku, Memory Match, and Reaction Tapper.
3. **Face Analyzer**: Webcam-based self-assessment for fatigue and stress.
4. **Wellness Tools**: Yoga instructions, meditation guidance, and a music player with a sleep timer.
5. **Mood Tracking**: Daily emoji-based mood logging.

## Local Setup Instructions
1. **Download**: Download the project as a ZIP from Replit and extract it.
2. **Prerequisites**: Install [Node.js](https://nodejs.org/).
3. **Installation**:
   ```bash
   npm install
   ```
4. **Configuration**: Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=a_random_secure_string
   ```
5. **Run Application**:
   ```bash
   npm run dev
   ```
6. **Access**: Open your browser and go to `http://localhost:5000`.

## Project Structure
- `/client/src/pages/`: Page components (Dashboard, Tasks, etc.)
- `/client/src/components/`: Reusable UI components
- `/server/`: Backend logic and API routes
- `/shared/`: Shared types and database schema
