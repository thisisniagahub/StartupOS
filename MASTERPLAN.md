
# StartupOS - Masterplan & Architecture Reference

> **Version:** 1.0 (Phase 8 Complete)
> **Status:** Production-Ready Frontend Scaffold
> **Tech Stack:** React 18, Tailwind, Gemini AI, Lucide, Recharts

## 1. Product Vision
**StartupOS** is an Integrated Startup Operating System designed to replace the fragmented stack of 20–30 SaaS tools typically used by founders. It consolidates Strategy, Execution, Growth, and Operations into a single "Control Center" powered by Generative AI.

**Core Philosophy:**
1.  **Unified Data:** User data flows between modules (e.g., An idea in "Ideation" auto-creates a roadmap in "Product" and a pitch deck in "Investor").
2.  **AI-Native:** AI is not a chatbot on the side; it is the engine. It validates ideas, drafts emails, and analyzes metrics.
3.  **Founder-Centric:** The UI is designed for speed, clarity, and "executive presence" (Dark mode, high contrast, dense information).

---

## 2. System Architecture

### Frontend (The "Shell")
*   **Framework:** React 18 (Vite/CRA compatible structure).
*   **Routing:** HashRouter (for easy static deployment and demoing).
*   **State:** Local Context (`AuthContext`, `TutorialContext`) + URL State.
*   **UI System:** "Magic UI" aesthetic using Tailwind CSS + Framer Motion.

### Data Layer (The "Simulation")
Currently, the app uses a **sophisticated simulation layer** to mimic a real production environment without needing a backend server immediately.
*   **Persistence:** `localStorageDb` (services/localStorageDb.ts) persists data to the browser.
*   **Realtime:** `realtimeService.ts` mimics WebSockets for live activity feeds and agent logs.
*   **AI:** Direct calls to Google Gemini API via `@google/genai`.

### Integration Layer (The "Nervous System")
*   **Synapse:** (`services/synapseService.ts`) Logic that moves data between modules automatically.
*   **MCP Bridge:** (`services/mcpService.ts` & `browserBridge.ts`) Connects the frontend to external tools, local files, and browser extensions.

---

## 3. Module Breakdown

### Phase 1: Strategy (The Brain)
1.  **Ideation & Innovation:** Gemini Pro reasoning to validate ideas and generate "Founder Archetypes".
2.  **Market Research:** Google Search Grounding to fetch live competitor data and trends.
3.  **Strategic Planning:** Business Model Canvas and SWOT analysis (Placeholder/Roadmap).

### Phase 2: Execution (The Hands)
4.  **Product Development:** Kanban-style roadmap and feature tracking.
5.  **R&D Lab:** Experiment tracking for hypothesis-driven development.

### Phase 3: Growth (The Voice)
6.  **Marketing & Growth:** Asset generator (Text, Image, Video) using Gemini & Veo.
7.  **Sales & CRM:** Deal pipeline with "Sales Copilot" for objection handling and email drafting.
8.  **Customer Support:** Unified ticket inbox with priority tagging.
9.  **Community:** Forum thread tracking and sentiment analysis.

### Phase 4: Operations (The Backbone)
10. **Finance:** Burn rate, runway visualization, and P&L monitoring.
11. **HR & Talent:** Applicant Tracking System (ATS) pipeline.
12. **Operations & SOPs:** Digital handbook for company processes.
13. **Supply Chain:** Inventory management and stock intake.
14. **Security & Risk:** SOC2/GDPR compliance checklist.

### Phase 5: Platform (The Nervous System)
15. **Analytics:** Business Intelligence dashboards.
16. **Data Infrastructure:** Schema governance and catalog.
17. **Investor Relations:** Fundraising pipeline, data room, and pitch deck generator.

---

## 4. AI Agent Framework
StartupOS implements an **Autonomous Agent** pattern located in `pages/AgentCommandCenter.tsx`.
*   **Monitors:** Watch data (e.g., Burn Rate) and alert on thresholds.
*   **Responders:** React to events (e.g., Auto-reply to leads).
*   **Tools:** Agents have access to `services/agentTools.ts` to perform actions like "Add Investor" or "Install App".

---

## 5. Development Roadmap

### Current Status: Phase 8 (Frontend Complete)
The application is a fully interactive, persistent Single Page Application (SPA). It looks and feels like a production SaaS but runs entirely in the browser.

### Next Steps: Phase 9 (The Real Backend)
To turn this into a sellable SaaS product ($49/mo), the following migration is required:

1.  **Database Migration:**
    *   Replace `services/localStorageDb.ts` with API calls to a Node.js/Postgres backend.
    *   Use the schema defined in `types.ts` to generate Prisma models.
2.  **Auth Hardening:**
    *   Replace `AuthContext` mock with Supabase Auth or Clerk.
3.  **MCP Server:**
    *   Deploy a real Node.js MCP server to handle the "Connectors" page, rather than simulating connections.
4.  **Stripe Integration:**
    *   Connect the `initiateCheckout` function in `BillingPage` to a real Stripe Checkout Session endpoint.

---

## 6. Directory Structure Key
*   `/components`: Reusable UI atoms (Cards, Buttons) and Layouts.
*   `/pages`: The 17 module views + Dashboard + Settings.
*   `/services`: The "Brain". Contains all business logic, AI calls, and mock DB adapters.
*   `/data`: Static configs (Docs, Tutorial steps).
*   `/context`: Global state providers.
