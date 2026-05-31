# Project Overview — JNV Alumni Network Platform

## 1. What Is This

A web platform connecting alumni of Jawahar Navodaya Vidyalaya (JNV) — a network of 661 government-run residential schools across India. With an estimated 15+ lakh alumni, this platform provides a dedicated space for networking, mentorship, job opportunities, marketplace, and community engagement.

## 2. Target Audience

- **Primary**: JNV alumni (batch 1986-2024) across India and abroad
- **Secondary**: Current JNV students (career guidance), JNV administration (event coordination)
- **Estimated market size**: 15 lakh alumni, 5-8 lakh active on social media

## 3. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 16 (App Router) | Server components, streaming, Turbopack |
| UI | Tailwind CSS 4 + Base UI | Modern styling, accessible components |
| Database | Supabase (PostgreSQL) | Free tier, RLS, real-time, storage |
| Auth | Supabase Auth | Email/password, session management |
| Storage | Supabase Storage | Avatar, marketplace, media buckets |
| Deployment | Netlify | Free tier, auto-deploy from Git |
| Language | TypeScript | Type safety across frontend and backend |

## 4. Architecture

```
Client (Browser)
    |
Next.js App Router (Server Components + Client Components)
    |
Server Actions (Business Logic)
    |
Supabase Client (Server-side)
    |
PostgreSQL + RLS + Storage
```

- **Server Components**: Data fetching, SEO, initial render
- **Client Components**: Interactive UI (forms, modals, real-time updates)
- **Server Actions**: All mutations go through server actions with validation
- **RLS**: Database-level security — users can only access their own data

## 5. Feature Inventory

### 5.1 Authentication (4 routes)
- Login with email/password
- Registration with 15+ profile fields (name, school, batch, state, profession, etc.)
- Forgot password (Supabase email reset)
- Admin approval workflow (new users are "pending" until admin approves)
- Pending approval page for unapproved users
- Middleware for auth session management

### 5.2 Dashboard (1 route)
- Welcome banner with user name
- Stats cards (total alumni, jobs, events, listings)
- Profile completion prompt (if fields are missing)
- Quick action cards (post job, create event, browse directory, etc.)
- Recent events and jobs sections

### 5.3 Alumni Directory (3 routes)
- Grid of alumni cards with avatar, name, school, profession, batch
- Full-text search by name
- Filter by state, batch year, skill, industry
- Pagination (URL-based)
- Detail page with full profile, contact links (LinkedIn, WhatsApp, portfolio)
- Server actions: getAlumni, getAlumniById

### 5.4 Marketplace (6 routes)
- Category navigation (Electronics, Vehicles, Real Estate, Agriculture, Services)
- Subcategory support
- Create listing with multi-image upload (up to 5)
- Listing cards with image, price, condition, location, wishlist button
- Advanced filters: price range, condition, state, sort order
- Listing detail page with image gallery, seller info, contact buttons
- Wishlist system (add/remove, dedicated wishlist page)
- My Listings management (edit, delete, mark as sold)
- Contact seller via phone or WhatsApp
- SOLD overlay on sold items
- Server actions: 8 actions covering CRUD, search, wishlist

### 5.5 Jobs Board (5 routes)
- Post job with 15+ fields (title, company, salary range, experience, skills, type, referral, contact)
- Job listing with search, type filters, referral filter
- Job detail page with skills tags, apply buttons
- In-app apply form (resume text, cover note)
- Application tracking (applied status, status badges)
- My Jobs management (view posted jobs, close jobs)
- Applicant list with status for job posters
- Salary display in LPA format (Indian standard)
- Server actions: 7 actions

### 5.6 Events (3 routes)
- Create event (title, date, venue/online, meeting URL, max attendees)
- Event listing with status filters (upcoming/past), search, pagination
- Event detail page with organizer info, registration button
- Registration system with capacity tracking
- Online event support (meeting URL)
- Status management (upcoming/ongoing/completed/cancelled)
- Server actions: 5 actions

### 5.7 Forum (3 routes)
- Create post with title, content, category
- Post listing with category filters, search, pagination
- Post detail page with full content
- Comment system (add, list)
- Like system (toggle, count, atomic increment)
- Post cards with author, category, comment/like counts
- Server actions: 6 actions

### 5.8 Announcements (3 routes)
- Create announcement (admin) with title, content, type, pin option
- Listing with type filters, search, pagination
- Detail page
- Pin support (pinned announcements show first)
- Server actions: 4 actions

### 5.9 Business Directory (3 routes)
- Register business with name, description, category, website, location
- Listing with category filters, search, pagination
- Detail page with owner info, contact, website
- 13 business categories
- Verification badge support
- Server actions: 4 actions

### 5.10 Media Gallery (3 routes)
- Upload media (image/video) with title, description, category, batch year
- Gallery grid with category filters, pagination
- Detail page with full media view, uploader info
- 7 media categories (School Life, Reunions, Events, etc.)
- Server actions: 4 actions

### 5.11 Mentorship (2 routes)
- Mentor listing with area filters, search, pagination
- Mentor cards with profession, areas, availability
- Request mentorship (select area, write message)
- My Requests page with sent/received tabs
- Accept/decline actions for incoming requests
- Status workflow: pending -> accepted/declined -> active -> completed
- 10 mentorship areas
- Server actions: 5 actions

### 5.12 Admin Panel (2 routes)
- User approvals queue (pending users with approve/reject)
- All users management (search, filter by role/status, change role)
- Confirmation dialogs for destructive actions
- Role-based access (admin-only routes)

### 5.13 Profile (2 routes)
- Profile view page with all fields
- Edit profile form with avatar upload
- Fields: name, email, mobile, WhatsApp, batch, school, state, city, profession, company, industry, skills, LinkedIn, portfolio, bio

### 5.14 Cross-Cutting
- **Dark Mode**: System/light/dark with ThemeProvider and toggle
- **Responsive Design**: Mobile-first across all 35+ routes
- **Loading States**: Skeleton loading on dashboard
- **Error Pages**: error.tsx, not-found.tsx
- **Input Validation**: Zod schemas on all forms
- **Input Sanitization**: sanitizeSearch(), sanitizeInput()
- **Full-Text Search**: FTS columns on 8 tables

## 6. Database Schema

### Tables (30+)
- profiles, marketplace_listings, marketplace_categories, marketplace_subcategories
- marketplace_wishlists, jobs, job_applications, events, event_registrations
- forum_posts, forum_comments, forum_likes, forum_categories
- announcements, businesses, media, mentorship_requests
- Plus supporting tables for RLS and functions

### Security
- RLS on every table
- Users can only read/write their own data
- Admin role for elevated access
- Storage buckets with RLS policies

### Performance
- Full-text search indexes on 8 tables
- Atomic SQL functions (increment_view_count, toggle_like, etc.)
- Proper foreign key indexes

## 7. Current Status

- **Built**: All 12 modules, 35+ routes, 30+ database tables
- **Deployed**: Netlify (production)
- **Repository**: GitHub (private)
- **Build**: Passes with zero errors
- **Market Value**: ~Rs 16 lakhs equivalent

## 8. What's Missing

See [ROADMAP.md](ROADMAP.md) for the phased plan to complete the platform.
See [PRICING_BREAKDOWN.md](PRICING_BREAKDOWN.md) for cost analysis.
See [AI_AGENT_PLAN.md](AI_AGENT_PLAN.md) for the AI/agentic features plan.
See [REVENUE_MODEL.md](REVENUE_MODEL.md) for monetization strategy.
