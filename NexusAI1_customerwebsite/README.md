# NexusAI (CallPilotAI)

NexusAI (internally branded as **CallPilotAI**) is a premium B2B service portal designed to capture and manage high-intent leads for **Custom Voice AI Agent** development. Unlike generic platforms, this system is the frontend for an agency that builds, trains, and deploys human-like AI agents tailored to specific business domains.

---

## 🎯 Business Purpose

The primary goal of this repository is to act as a **Lead Generation & Service Inquiry Platform**. It targets businesses in high-volume sectors (Real Estate, Solar, SaaS, Insurance) that need bespoke AI agents to:
- Prospect and qualify cold leads 24/7.
- Sync qualified opportunities directly into their CRM.
- Handle inbound/outbound sales calls with ultra-realistic voice synthesis.

---

## 🚀 Service Features (The "Custom" Edge)

- **Domain-Specific Training**: Custom agents trained on client-specific knowledge bases and sales scripts.
- **Industry Customization**: Pre-optimized flows for **Real Estate**, **Solar**, **Insurance**, and **SaaS** providers.
- **High-Conversion Landing Page**: A premium, "glassmorphic" UI designed to establish trust and "WOW" Enterprise-level prospects.
- **Intelligent Inquiry System**: A complex lead capture flow that collects industry type, budget, and specific requirements to streamline the sales process.
- **Scalable Engagement**: AI that scales beyond human capacity while maintaining 95%+ accuracy.

---

## 🛠️ Technical Architecture

### Agency-First Full Stack
- **Frontend (Visual Excellence)**: Built with **React 18**, **Tailwind CSS**, and **Framer Motion**. It utilizes complex parallax effects and smooth transitions to reflect the "premium" nature of the service.
- **Shared Schema (Lead Logic)**: Centralized **Zod** and **Drizzle** schemas ensure that the inquiry data is validated on both ends before reaching the database.
- **Backend (Lead Management)**: An **Django** server that handles inquiry storage and integrates with an extensible database layer.
- **Database (PostgreSQL)**: Tracks internal `ai_services` offered and stores all client `inquiries` for agency follow-up.

### Core Stack
- **Frontend**: Talwind css, react, vite
- **Backend**: Django
- **Storage**: PostgreSQL.

---

## 📂 Project Structure

```bash
├── client/          # Agency Frontend (Lead Capture)
│   ├── src/
│   │   ├── components/
│   │   │   ├── sections/ # Hero, TechStack, Services, Contact (Primary Lead Gen)
│   │   │   └── ui/       # Premium UI components & Bot Assistant
│   │   ├── hooks/       # API integration hooks (use-inquiries)
│   │   └── pages/       # High-conversion Home & 404 pages
├── server/          # Agency Backend (Inquiry Processing)
│   ├── index.ts     # Entry point & Request logging
│   ├── routes.ts    # Lead capture API & Service listing
│   └── storage.ts   # Lead persistence layer
├── shared/          # Core Business Logic
│   ├── schema.ts    # Inquiry & Service database models
│   └── routes.ts    # Type-safe API contracts
└── script/          # CI/CD & Build orchestration
```

---

## 🏁 Development & Setup

### Prerequisites
- Node.js (v20+)
- PostgreSQL Database

### Setup
1. `npm install`
2. Create `.env` with `DATABASE_URL=postgresql://...`
3. `npm run dev`

