# JNV Alumni Network Platform

A full-featured alumni networking platform built for Jawahar Navodaya Vidyalaya graduates, connecting 15+ lakh alumni across 661 schools in India.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: Supabase (PostgreSQL + Row Level Security)
- **Auth**: Supabase Auth (email/password with admin approval)
- **Storage**: Supabase Storage (avatars, marketplace images, media)
- **Styling**: Tailwind CSS 4 + Base UI components
- **Language**: TypeScript
- **Deployment**: Netlify

## Features (Built)

| Module | Description |
|---|---|
| **Authentication** | Login, register, forgot password, admin approval workflow |
| **Dashboard** | Stats, quick actions, recent activity, profile completion |
| **Alumni Directory** | Search, filter by state/batch/skill, pagination, profile pages |
| **Marketplace** | Listings with images, categories, wishlist, filters, contact seller |
| **Jobs Board** | Post jobs, apply, track applications, referral tagging |
| **Events** | Create events, register, online/offline, capacity limits |
| **Forum** | Posts, comments, likes, categories |
| **Announcements** | Pinned announcements, type filtering |
| **Businesses** | Alumni business directory with categories |
| **Media Gallery** | Photo/video uploads with categories |
| **Mentorship** | Request mentors, accept/decline, area-based matching |
| **Admin Panel** | User approvals, role management, user search |
| **Dark Mode** | System/light/dark with theme persistence |
| **Responsive** | Mobile-first design across all 35+ routes |

## Project Structure

```
src/
  app/
    (auth)/          # Login, register, forgot-password
    (dashboard)/     # All authenticated pages
      admin/         # Admin panel
      announcements/ # Announcements CRUD
      businesses/    # Business directory
      directory/     # Alumni directory
      events/        # Events CRUD + registration
      forum/         # Forum posts + comments
      jobs/          # Jobs CRUD + applications
      marketplace/   # Marketplace + wishlist
      media/         # Media gallery
      mentorship/    # Mentorship system
      profile/       # User profile
      wishlist/      # Wishlist page
    api/             # API routes (auth callback)
  components/
    layout/          # Sidebar, topbar, mobile-nav
    ui/              # Base UI components (button, card, etc.)
    marketplace/     # Marketplace-specific components
    directory/       # Directory components
    events/          # Event components
    forum/           # Forum components
    jobs/            # Job components
    mentorship/      # Mentorship components
    businesses/      # Business components
    providers/       # Theme provider
  lib/
    actions/         # Server actions (all business logic)
    supabase/        # Supabase client/server helpers
    types/           # TypeScript types
    constants.ts     # App constants, nav items, JNV schools
    utils.ts         # Utility functions
supabase/
  migrations/        # Database migrations (schema + seed)
```

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (free tier works)

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.local.example` to `.env.local` and fill in Supabase credentials
4. Run Supabase migrations
5. Start dev server: `npm run dev`

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Documentation

| Document | Description |
|---|---|
| [Project Overview](docs/PROJECT_OVERVIEW.md) | Complete feature inventory and architecture |
| [Roadmap](docs/ROADMAP.md) | Phased implementation plan with priorities |
| [Pricing Breakdown](docs/PRICING_BREAKDOWN.md) | Development cost analysis by feature |
| [Revenue Model](docs/REVENUE_MODEL.md) | Monetization strategy and projections |
| [AI Agent Plan](docs/AI_AGENT_PLAN.md) | LangGraph agentic features specification |

## Database

- 30+ tables with Row Level Security
- Full-text search on 8 tables
- Atomic SQL functions for race-condition prevention
- 3 storage buckets with RLS policies

## Routes

35+ routes across 12 modules. See `npm run build` output for the full route list.

## License

Private - All rights reserved.
