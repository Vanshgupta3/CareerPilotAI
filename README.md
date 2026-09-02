# CareerPilot AI

**AI-powered career preparation platform** — analyze resumes, get an ATS score with actionable feedback, and practice role-specific mock interviews with instant AI-generated evaluation.

🔗 **Live Demo:** [careerpilotai-pi.vercel.app](https://careerpilotai-pi.vercel.app/)

---

## Overview

CareerPilot AI helps job seekers prepare end-to-end for their next role. Users upload a resume to receive an AI-generated ATS score and quality breakdown, then run personalized mock interviews — selecting job role, experience level, interview type, and question count — with responses evaluated and scored in real time.

The platform is built as a full-stack application with a relational data layer to track users, resumes, interview sessions, questions, responses, feedback, and historical performance over time.

## Features

- **Resume Analysis** — Upload a resume and receive an AI-generated ATS score, along with grammar, formatting, readability, and keyword-relevance breakdowns.
- **AI Mock Interviews** — Configure job role, experience level (e.g. Intern, Entry-level), interview type (Technical, Behavioral, etc.), and number of questions (2–30); questions are generated dynamically based on the uploaded resume.
- **Live Adaptive Mode** — Interview questions can adapt in real time based on prior responses, in addition to a standard fixed-question mode.
- **Instant Performance Feedback** — After each interview, get an overall score plus a breakdown across technical knowledge, communication, confidence, and problem-solving, along with ideal answers for review.
- **History & Progress Tracking** — Dashboard tracks interviews taken, completion rate, and average scores over time.
- **Downloadable Reports** — Export interview performance reports.

## Tech Stack

**Frontend**
- React.js

**Backend**
- Node.js
- Express.js

**Database**
- PostgreSQL
- Prisma ORM

**AI / LLM**
- Gemini AI — used for dynamic question generation and response evaluation

**Architecture**
- Backend organized into routes, middleware, controllers, and services to separate concerns and keep the codebase maintainable
- REST API design connecting the frontend, backend, database, and AI services into a single end-to-end workflow

## How It Works

1. **Sign up / Log in** — Create an account to access the dashboard.
2. **Upload Resume** — Upload a resume for AI-powered ATS analysis (score, grammar, formatting, and a generated professional summary).
3. **Configure an Interview** — Choose job role, experience level, interview type, and number of questions.
4. **Take the Interview** — Answer AI-generated, resume-aware questions in Standard or Live Adaptive mode.
5. **Review Feedback** — Get an overall score and category-level breakdown (technical knowledge, communication, confidence, problem-solving), plus ideal answers.
6. **Track Progress** — Revisit past interviews and performance trends from the dashboard and history page.

## Data Model (high level)

The application uses PostgreSQL with Prisma to model:
- Users
- Resumes
- Interview sessions
- Questions
- Responses
- Feedback
- Historical performance data

## Screenshots

| Landing Page | Resume ATS Report | Interview Setup | Performance Feedback |
|---|---|---|---|
| AI-powered career platform hero section | ATS score + resume metrics breakdown | Configure job role, level, and interview type | Overall score with category breakdown |

*(Add screenshot images to a `/screenshots` folder and reference them here, e.g. `![Dashboard](./screenshots/dashboard.png)`)*

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Vanshgupta3/AI-Interview-Platform.git
cd AI-Interview-Platform

# Install dependencies (backend)
cd backend
npm install

# Install dependencies (frontend)
cd ../frontend
npm install

# Set up environment variables
# Create a .env file in /backend with:
# DATABASE_URL=your_postgresql_connection_string
# GEMINI_API_KEY=your_gemini_api_key
# JWT_SECRET=your_jwt_secret

# Run database migrations
npx prisma migrate dev

# Start the backend
npm run dev

# In a separate terminal, start the frontend
cd ../frontend
npm run dev
```

> Adjust the commands above to match your actual folder structure and scripts if they differ.

## What I Learned

Building CareerPilot AI gave me hands-on experience with:
- Integrating LLMs (Gemini AI) into a real-world, production-style application
- Designing REST APIs and relational schemas for a multi-entity domain
- Handling and structuring AI-generated outputs reliably
- Building a complete end-to-end AI workflow connecting frontend, backend, database, and AI services
- Structuring a backend for maintainability using a routes/middleware/controllers/services pattern


