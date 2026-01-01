# StartupOS - Integrated Operating System

A production-grade React scaffold for an integrated Startup Operating System, replacing 20+ SaaS tools.

## Architecture

- **Frontend**: React 18, Tailwind CSS, Lucide Icons, Recharts
- **State Management**: React Hooks (local), URL state (Router)
- **AI Integration**: Google Gemini SDK (@google/genai)
- **Design System**: "Magic UI" inspired dark mode aesthetic (Red/Black)
- **Database**: PostgreSQL (Prisma ORM) / Local Storage Fallback for Demo
- **Testing**: Playwright E2E

## Features

1.  **Founder Dashboard**: High-level KPIs and activity.
2.  **Ideation Engine**: Validate ideas using Gemini Pro reasoning.
3.  **Market Intelligence**: Competitor analysis with Gemini Grounding (Search).
4.  **Product Roadmap**: Kanban-style feature tracking.
5.  **Module System**: Scalable architecture for 17+ modules including HR, Finance, and Sales.
6.  **Billing**: Stripe subscription integration (Mock).

## Setup & Run

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Set API Key:
    - Create a `.env` file (or use environment variables in your deployment).
    - Add `API_KEY=your_gemini_api_key`.
4.  Run locally: `npm run dev` (or `vite` if using Vite).

### Credentials
For the demo login, use:
- **Email**: `admin@startupos.com`
- **Password**: `admin123`

## Testing

This project uses Playwright for End-to-End testing.

1.  Install Browsers: `npx playwright install`
2.  Run Tests: `npx playwright test`
3.  View Report: `npx playwright show-report`

## Extension Guide

To add a new module (e.g., "Legal"):

1.  Add configuration to `constants.ts`.
2.  Create `pages/LegalModule.tsx`.
3.  Add route to `App.tsx`.
4.  Implement services in `services/`.

## Coding Standards

- **Strict Types**: No `any` unless absolutely necessary.
- **Components**: Functional components only.
- **Styling**: Tailwind utility classes only. No CSS files.