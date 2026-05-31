# Pricing Breakdown — JNV Alumni Network Platform

## How IT Companies Calculate Cost

1. **Requirement Analysis** — Break features into user stories
2. **Effort Estimation** — Assign hours per story (Simple: 2-8hrs, Medium: 8-20hrs, Complex: 20-40hrs)
3. **Cost Calculation** — Total hours x hourly rate + overhead + margin

## Rate Card Reference

| Provider Type | Hourly Rate (INR) | Hourly Rate (USD) |
|---|---|---|
| Indian freelancer | Rs 500-1,500 | $6-18 |
| Small Indian IT company | Rs 1,000-2,500 | $12-30 |
| Mid-tier Indian company | Rs 2,000-3,500 | $24-42 |
| Top-tier (TCS, Infosys) | Rs 3,000-5,000 | $36-60 |
| International agency | Rs 4,000-12,500 | $50-150 |

---

## Part A: What's Already Built (Market Value: ~Rs 16L)

| Section | Hours | Value @ Rs 1,500/hr |
|---|---|---|
| Database & Backend (schema, RLS, FTS, migrations) | 88 | Rs 1,32,000 |
| Authentication (login, register, approval, middleware) | 72 | Rs 1,08,000 |
| Dashboard (stats, actions, activity) | 30 | Rs 45,000 |
| Alumni Directory (search, filter, pagination, detail) | 74 | Rs 1,11,000 |
| Marketplace (CRUD, images, wishlist, filters, contact) | 172 | Rs 2,58,000 |
| Jobs Board (post, apply, manage, applications) | 100 | Rs 1,50,000 |
| Events (create, register, capacity, online/offline) | 60 | Rs 90,000 |
| Forum (posts, comments, likes, categories) | 72 | Rs 1,08,000 |
| Announcements (CRUD, pins, types) | 38 | Rs 57,000 |
| Business Directory (CRUD, categories, verification) | 42 | Rs 63,000 |
| Media Gallery (upload, grid, categories) | 38 | Rs 57,000 |
| Mentorship (request, accept/decline, status flow) | 50 | Rs 75,000 |
| Admin Panel (approvals, user management) | 50 | Rs 75,000 |
| Layout & Navigation (sidebar, topbar, mobile nav) | 56 | Rs 84,000 |
| UI Components & Styling (Base UI, Tailwind, dark mode) | 44 | Rs 66,000 |
| Mobile Responsiveness (all pages) | 37 | Rs 55,500 |
| Utilities & Config (types, schemas, constants, deploy) | 41 | Rs 61,500 |
| **TOTAL BUILT** | **1,064 hrs** | **Rs 15,96,000** |

---

## Part B: Missing Features (Phase 1-4)

### Phase 1 — Launch-Critical

| Feature | Hours | Freelancer @ Rs 800/hr | Company @ Rs 2,000/hr |
|---|---|---|---|
| Notification System (In-App) | 70 | Rs 56,000 | Rs 1,40,000 |
| Email Infrastructure (Resend) | 50 | Rs 40,000 | Rs 1,00,000 |
| User Settings Page | 40 | Rs 32,000 | Rs 80,000 |
| Account Deletion | 20 | Rs 16,000 | Rs 40,000 |
| Privacy Policy & Terms | 15 | Rs 12,000 | Rs 30,000 |
| Rate Limiting & Security | 30 | Rs 24,000 | Rs 60,000 |
| Content Moderation | 40 | Rs 32,000 | Rs 80,000 |
| **Phase 1 Total** | **265 hrs** | **Rs 2,12,000** | **Rs 5,30,000** |

### Phase 2 — Professional Quality

| Feature | Hours | Freelancer @ Rs 800/hr | Company @ Rs 2,000/hr |
|---|---|---|---|
| Error Tracking (Sentry) | 18 | Rs 14,400 | Rs 36,000 |
| Analytics (PostHog) | 35 | Rs 28,000 | Rs 70,000 |
| SEO Optimization | 30 | Rs 24,000 | Rs 60,000 |
| Security Headers | 10 | Rs 8,000 | Rs 20,000 |
| Global Search (Cmd+K) | 35 | Rs 28,000 | Rs 70,000 |
| Social Sharing | 18 | Rs 14,400 | Rs 36,000 |
| Audit Logging | 22 | Rs 17,600 | Rs 44,000 |
| **Phase 2 Total** | **168 hrs** | **Rs 1,34,400** | **Rs 3,36,000** |

### Phase 3 — Community Engagement

| Feature | Hours | Freelancer @ Rs 800/hr | Company @ Rs 2,000/hr |
|---|---|---|---|
| Direct Messaging / Chat | 100 | Rs 80,000 | Rs 2,00,000 |
| Testing Suite | 75 | Rs 60,000 | Rs 1,50,000 |
| Export Functionality | 30 | Rs 24,000 | Rs 60,000 |
| Advanced Profile | 35 | Rs 28,000 | Rs 70,000 |
| **Phase 3 Total** | **240 hrs** | **Rs 1,92,000** | **Rs 4,80,000** |

### Phase 4 — Differentiation

| Feature | Hours | Freelancer @ Rs 800/hr | Company @ Rs 2,000/hr |
|---|---|---|---|
| Alumni Map | 40 | Rs 32,000 | Rs 80,000 |
| Batch Reunions | 60 | Rs 48,000 | Rs 1,20,000 |
| Donations (Razorpay) | 65 | Rs 52,000 | Rs 1,30,000 |
| PWA | 30 | Rs 24,000 | Rs 60,000 |
| Two-Factor Auth | 30 | Rs 24,000 | Rs 60,000 |
| Multi-language (Hindi) | 40 | Rs 32,000 | Rs 80,000 |
| Success Stories | 25 | Rs 20,000 | Rs 50,000 |
| **Phase 4 Total** | **290 hrs** | **Rs 2,32,000** | **Rs 5,80,000** |

### Phase 1-4 Combined

| | Hours | Freelancer | Company |
|---|---|---|---|
| **Total New Features** | **963 hrs** | **Rs 7,70,400** | **Rs 19,26,000** |

---

## Part C: AI / Agentic Layer

| Component | Hours | Freelancer @ Rs 1,200/hr | Company @ Rs 2,500/hr |
|---|---|---|---|
| Agent Core (LangGraph, tools, API, persistence) | 160 | Rs 1,92,000 | Rs 4,00,000 |
| Chat UI (widget, messages, input, actions) | 67 | Rs 80,400 | Rs 1,67,500 |
| Quick Action Workflows (7 flows) | 152 | Rs 1,82,400 | Rs 3,80,000 |
| Smart Matching (pgvector, embeddings) | 87 | Rs 1,04,400 | Rs 2,17,500 |
| AI Content Generation | 48 | Rs 57,600 | Rs 1,20,000 |
| Admin AI Tools | 64 | Rs 76,800 | Rs 1,60,000 |
| **AI Total** | **578 hrs** | **Rs 6,93,600** | **Rs 14,45,000** |

---

## Grand Total — All Development

| Component | Hours | Freelancer | Company |
|---|---|---|---|
| Already Built | 1,064 | Rs 0 (done) | Rs 0 (done) |
| Phase 1-4 (missing features) | 963 | Rs 7,70,400 | Rs 19,26,000 |
| Phase 5 (AI/Agent) | 578 | Rs 6,93,600 | Rs 14,45,000 |
| Infrastructure setup | 10 | Rs 2,000 | Rs 2,000 |
| **TOTAL NEW** | **1,551 hrs** | **Rs 14,66,000** | **Rs 33,73,000** |
| **TOTAL PROJECT VALUE** | **2,615 hrs** | **Rs 30,62,000** | **Rs 49,69,000** |

---

## Monthly Running Costs

### At 50 Users (Just Launched)

| Service | Cost |
|---|---|
| Supabase (free tier) | Rs 0 |
| Netlify (free tier) | Rs 0 |
| Resend (free: 100 emails/day) | Rs 0 |
| Sentry (free: 5K errors/mo) | Rs 0 |
| PostHog (free: 1M events/mo) | Rs 0 |
| OpenAI API (~500 requests) | Rs 200-500 |
| Domain (.com) | Rs 70-100 |
| **TOTAL** | **Rs 270-600/mo** |

### At 500 Users (Growing)

| Service | Cost |
|---|---|
| Supabase Pro | Rs 2,100 |
| Netlify Pro | Rs 1,600 |
| Resend (50K emails/mo) | Rs 1,600 |
| Sentry Team | Rs 2,200 |
| PostHog (free) | Rs 0 |
| OpenAI API (~5K requests) | Rs 2,000-5,000 |
| **TOTAL** | **Rs 9,500-12,600/mo** |

### At 10,000 Users (Active Platform)

| Service | Cost |
|---|---|
| Supabase Pro + compute | Rs 8,500 |
| Vercel Pro + bandwidth | Rs 3,300 |
| Resend Business | Rs 6,600 |
| Sentry Business | Rs 6,600 |
| PostHog Cloud | Rs 4,200 |
| OpenAI API (~100K requests) | Rs 40,000-80,000 |
| Redis (Upstash) | Rs 2,000 |
| CDN (Cloudflare Pro) | Rs 1,700 |
| **TOTAL** | **Rs 73,000-1,13,000/mo** |

---

## Team Composition (If Outsourcing)

### Freelancer Model (~10 months)

| Role | Duration | Monthly Rate | Total |
|---|---|---|---|
| Full-stack Developer | 7 months | Rs 80,000 | Rs 5,60,000 |
| AI/ML Engineer | 3.5 months | Rs 1,00,000 | Rs 3,50,000 |
| **Total** | | | **Rs 9,10,000** |

### Small Company Model (~5 months)

| Role | Duration | Monthly Rate | Total |
|---|---|---|---|
| Project Manager | 5 months | Rs 80,000 | Rs 4,00,000 |
| Senior Full-stack Dev | 5 months | Rs 1,20,000 | Rs 6,00,000 |
| Junior Dev | 5 months | Rs 40,000 | Rs 2,00,000 |
| AI/ML Engineer | 3 months | Rs 1,50,000 | Rs 4,50,000 |
| QA Tester | 2 months | Rs 50,000 | Rs 1,00,000 |
| **Team Total** | | | **Rs 17,50,000** |
| Company Margin (50%) | | | **Rs 8,75,000** |
| **Client Quote** | | | **Rs 26,25,000** |

---

## Cost Per User

| Scale | Annual Total Cost | Cost Per User/Year | Cost Per User/Month |
|---|---|---|---|
| 50 users | Rs 14,70,000 | Rs 29,400 | Rs 2,450 |
| 500 users | Rs 16,00,000 | Rs 3,200 | Rs 267 |
| 2,000 users | Rs 37,00,000 | Rs 1,850 | Rs 154 |
| 10,000 users | Rs 45,00,000 | Rs 450 | Rs 38 |
