# Roadmap — JNV Alumni Network Platform

## Current State

12 modules built, 35+ routes, 30+ database tables, deployed on Netlify. Market value ~Rs 16L.

---

## Phase 1 — Launch-Critical (Must-Have Before Public Launch)

**Goal**: Make the app legally compliant, secure, and communication-ready.
**Estimated effort**: 265 hours
**Priority**: HIGHEST

| # | Feature | What It Includes | Hours |
|---|---|---|---|
| 1.1 | Notification System (In-App) | notifications table + RLS, bell icon in topbar with unread count, dropdown (latest 10), notifications page (all), mark read (single + all), triggers on 8 event types, real-time subscription | 70 |
| 1.2 | Email Infrastructure | Resend SDK, email utility wrapper, HTML templates, welcome email, account approved, password reset, job application received, mentorship request, event reminder (24hr), weekly digest, unsubscribe handling | 50 |
| 1.3 | User Settings Page | /settings with tabs, change password, notification preferences (10 toggles), privacy controls (profile visibility, hide phone/email), user_preferences table, apply privacy to directory queries | 40 |
| 1.4 | Account Deletion | Delete button in settings, confirmation with password, cascade delete all data, download data as JSON before deletion, Supabase auth user deletion | 20 |
| 1.5 | Privacy Policy & Terms | /privacy page, /terms page, cookie consent banner, consent tracking, links in footer + registration | 15 |
| 1.6 | Rate Limiting | Token bucket rate limiter, limits on all server actions, Cloudflare Turnstile on registration/login, honeypot fields, error handling | 30 |
| 1.7 | Content Moderation | Report button on all user content, reports table, admin moderation queue, approve/dismiss/warn/ban actions, banned words filter, warning system (3 strikes), ban notification | 40 |

---

## Phase 2 — Professional Quality (First Month After Launch)

**Goal**: Make the app discoverable, monitorable, and polished.
**Estimated effort**: 168 hours
**Priority**: HIGH

| # | Feature | What It Includes | Hours |
|---|---|---|---|
| 2.1 | Error Tracking (Sentry) | @sentry/nextjs setup, client + server config, source maps, error boundaries, custom context, performance monitoring, alerts, release tracking | 18 |
| 2.2 | Analytics (PostHog) | SDK integration, page views, custom events (job_applied, listing_created, etc.), user identification, admin dashboard with charts (users, DAU/MAU, feature usage, funnel) | 35 |
| 2.3 | SEO Optimization | Dynamic generateMetadata on 12 detail pages, OG tags, Twitter Cards, sitemap.ts, robots.ts, JSON-LD for jobs/events, canonical URLs, meta descriptions | 30 |
| 2.4 | Security Headers | CSP, X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, security.txt | 10 |
| 2.5 | Global Search (Cmd+K) | Command palette (cmdk), keyboard shortcut, search API across 8 modules, grouped results, recent searches, mobile search button | 35 |
| 2.6 | Social Sharing | Share button component, WhatsApp share (primary), LinkedIn share, copy link, OG tags for rich previews, share count tracking | 18 |
| 2.7 | Audit Logging | audit_logs table, log admin actions, log sensitive user actions, admin viewer with filters, 90-day retention | 22 |

---

## Phase 3 — Community Engagement (Month 2-3)

**Goal**: Build stickiness with messaging, testing, and richer profiles.
**Estimated effort**: 240 hours
**Priority**: MEDIUM-HIGH

| # | Feature | What It Includes | Hours |
|---|---|---|---|
| 3.1 | Direct Messaging | conversations + messages tables, RLS, conversation list page, message thread, real-time (Supabase Realtime), unread badge, typing indicator, image sharing, Message button on profiles, block user | 100 |
| 3.2 | Testing Suite | Vitest setup, unit tests (utilities, schemas, server actions), component tests (React Testing Library), E2E tests (Playwright — registration, listing, apply, register flows), GitHub Actions CI | 75 |
| 3.3 | Export Functionality | CSV export utility, admin exports (users, listings, jobs, events), job poster export (applicants), event organizer export (attendees), user data export (GDPR), PDF profile export | 30 |
| 3.4 | Advanced Profile | Completion percentage bar, "looking for" tags, endorsement system, profile views counter, verification badge, rich text bio | 35 |

---

## Phase 4 — Differentiation (Month 3+)

**Goal**: Stand out from other alumni networks with unique features.
**Estimated effort**: 290 hours
**Priority**: MEDIUM

| # | Feature | What It Includes | Hours |
|---|---|---|---|
| 4.1 | Alumni Map | Leaflet.js/react-simple-maps, India map with state coloring, click to list, city clusters, map page + dashboard widget | 40 |
| 4.2 | Batch Reunions | reunions table, creation form, date/venue polls, RSVP tracking, shared photo album, cost splitting, invitation system | 60 |
| 4.3 | Donations / Fundraising | Razorpay integration, campaign CRUD, progress bar, donor wall, 80G receipt PDF, fund allocation tracking, webhooks, refunds | 65 |
| 4.4 | PWA | manifest.json, service worker, offline caching, install prompt, push notifications (Firebase FCM), app icons, splash screens | 30 |
| 4.5 | Two-Factor Auth | TOTP (otpauth), QR code setup, recovery codes, 2FA on login, management page, admin enforcement option | 30 |
| 4.6 | Multi-language | next-intl, language detection, switcher, English strings (~500), Hindi translations (~500), locale routing, date/number formatting | 40 |
| 4.7 | Success Stories | achievements table, submission/nomination form, categories (Government, Business, Academia, Sports, Social Impact), admin approval, featured on dashboard | 25 |

---

## Phase 5 — AI / Agentic Layer (See AI_AGENT_PLAN.md)

**Goal**: Transform the platform with an AI assistant and smart features.
**Estimated effort**: 578 hours
**Priority**: MEDIUM (can be built incrementally)

| # | Feature | Hours |
|---|---|---|
| 5.1 | Agent Core (LangGraph + tools + API) | 160 |
| 5.2 | Chat UI (widget + messages + input) | 67 |
| 5.3 | Quick Actions (7 workflows) | 152 |
| 5.4 | Smart Matching (pgvector + embeddings) | 87 |
| 5.5 | AI Content Generation | 48 |
| 5.6 | Admin AI Tools | 64 |

---

## Summary

| Phase | Hours | Timeline | Cumulative |
|---|---|---|---|
| Already Built | 1,064 | Done | 1,064 hrs |
| Phase 1 (Launch) | 265 | 4-6 weeks | 1,329 hrs |
| Phase 2 (Professional) | 168 | 3-4 weeks | 1,497 hrs |
| Phase 3 (Engagement) | 240 | 4-6 weeks | 1,737 hrs |
| Phase 4 (Differentiation) | 290 | 5-8 weeks | 2,027 hrs |
| Phase 5 (AI/Agent) | 578 | 10-14 weeks | 2,605 hrs |
| **TOTAL** | **2,605 hrs** | **~10-12 months** | |

## Verification

After each phase:
- `npx next build` passes with zero errors
- Manual testing at 320px, 375px, 768px, 1024px, 1440px viewports
- All new server actions have Zod validation
- RLS policies on any new tables
- No regressions in existing features
