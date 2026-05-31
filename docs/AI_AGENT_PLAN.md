# AI Agent Plan — LangGraph Integration

## Overview

Add an AI assistant layer to the JNV Alumni Network using LangGraph, transforming the platform from a static CRUD app into an intelligent, action-oriented system where users can accomplish tasks through natural conversation.

## Architecture

```
User (Chat UI)
    |
    v
Next.js API Route (/api/chat)
    |
    v
LangGraph Agent (Supervisor)
    |
    +--> Search Agent (read-only tools)
    |       - search_alumni
    |       - search_jobs
    |       - search_events
    |       - search_listings
    |       - get_recommendations
    |
    +--> Action Agent (write tools, requires confirmation)
    |       - create_job
    |       - create_listing
    |       - register_event
    |       - request_mentor
    |       - send_notification
    |
    +--> Content Agent (generation tools)
            - generate_job_description
            - generate_listing_from_image
            - generate_profile_bio
            - summarize_content
```

## Tech Stack

| Component | Technology | Why |
|---|---|---|
| Agent Framework | LangGraph.js | Same runtime as Next.js, no separate backend needed |
| LLM (primary) | GPT-4o-mini | Low cost, fast, good enough for 90% of tasks |
| LLM (complex) | GPT-4o | Image analysis, complex generation |
| Vector DB | Supabase pgvector | Already using Supabase, no new service |
| Embeddings | text-embedding-3-small | Best cost/quality ratio |
| Streaming | Server-Sent Events (SSE) | Real-time response display |
| Memory | Supabase (chat tables) | Persistent conversation history |

### Why LangGraph.js over Python

- Same deployment (Netlify/Vercel), no separate backend service
- Shared TypeScript types with the rest of the app
- Direct access to Supabase client and server actions
- Simpler infrastructure, lower hosting costs

---

## Component 1: Agent Core (160 hours)

### 1.1 State Schema

```typescript
interface AgentState {
  messages: Message[]
  userId: string
  userProfile: Profile
  currentPage: string
  toolResults: ToolResult[]
  pendingAction: PendingAction | null  // for human-in-the-loop
}
```

### 1.2 Supervisor Agent

Routes user messages to the correct sub-agent:
- "Find alumni..." -> Search Agent
- "Post a job..." -> Action Agent
- "Write a description..." -> Content Agent
- General questions -> Direct LLM response

### 1.3 Tool Definitions (12 tools)

| Tool | Type | What It Does |
|---|---|---|
| search_alumni | Read | Query directory with filters (name, state, batch, skill) |
| search_jobs | Read | Find jobs matching criteria (type, location, salary, skills) |
| search_events | Read | Find events (upcoming, by location, by type) |
| search_listings | Read | Search marketplace (category, price, condition, location) |
| get_user_profile | Read | Fetch current user's full profile |
| get_recommendations | Read | AI-powered suggestions based on profile |
| create_job | Write | Post a new job (requires user confirmation) |
| create_listing | Write | Create marketplace listing (requires confirmation) |
| register_event | Write | Register user for an event |
| request_mentor | Write | Send mentorship request |
| send_notification | Write | Trigger in-app notification |
| generate_content | Generate | Create text content (descriptions, bios, summaries) |

### 1.4 Human-in-the-Loop

All write operations require user confirmation:
1. Agent prepares the action (e.g., job posting with all fields)
2. Shows preview card to user: "I'll create this job posting. Confirm?"
3. User clicks Confirm or Edit
4. Agent executes or re-gathers information

### 1.5 Conversation Persistence

New database tables:
```sql
-- Chat conversations
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'tool')),
  content TEXT NOT NULL,
  tool_calls JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Component 2: Chat UI (67 hours)

### 2.1 Chat Widget

- Floating button (bottom-right corner) on all dashboard pages
- Click to expand chat panel (400px wide on desktop, full-screen on mobile)
- Minimize/maximize/close controls
- Persists open state across page navigation
- Animated transitions (slide up on open)

### 2.2 Message Rendering

- User messages: right-aligned bubbles
- Assistant messages: left-aligned with markdown support
- Streaming display: words appear one by one
- Tool call visualization: "Searching for jobs..." with spinner
- Action cards: clickable cards showing search results (job/event/alumni)
- Error messages: red-tinted with retry button

### 2.3 Chat Input

- Auto-resizing textarea
- Send button + Enter key (Shift+Enter for newline)
- Suggested prompts on empty state:
  - "Find alumni from my school"
  - "Post a job"
  - "Find a mentor for career guidance"
  - "What events are coming up?"

---

## Component 3: Quick Action Workflows (152 hours)

### 3.1 "Find a Mentor" Flow

```
User clicks "Find a Mentor" or types "I need a mentor"
    |
    v
[analyze_profile] Extract user's career stage, interests, goals
    |
    v
[search_mentors] Find mentors matching area + industry
    |
    v
[rank_by_relevance] Score mentors by compatibility
    |
    v
[present_results] Show top 5 mentor cards with match score
    |
    v
User selects a mentor
    |
    v
[request_mentor] Send mentorship request with auto-generated message
    |
    v
[confirm] "Request sent to Dr. Sharma! They'll be notified."
```

### 3.2 "Find Jobs for Me" Flow

```
[get_profile] Extract skills, experience, location, salary expectations
    |
    v
[search_jobs] Vector similarity search + traditional filters
    |
    v
[calculate_match] Score: skill overlap + experience fit + location + salary
    |
    v
[present_top_5] Show job cards with match percentage
    |
    v
User selects → [apply] or [save_for_later]
```

### 3.3 "Post a Job" Flow

```
[get_company] Auto-fill company from user profile
    |
    v
[ask_missing] "What role? Salary range? Experience needed?"
    |
    v
[generate_description] AI writes professional job description
    |
    v
[preview] Show complete job posting preview
    |
    v
User confirms or edits
    |
    v
[create_job] Post to jobs board
    |
    v
[notify_matches] "5 alumni match this job. Notify them?"
```

### 3.4 "Sell Something" Flow (Image-First)

```
User uploads photo
    |
    v
[analyze_image] GPT-4o vision: identify item, brand, condition
    |
    v
[generate_details] Title, description, category, price suggestion
    |
    v
[preview] "I think this is a Samsung Galaxy S23, Good condition, ~Rs 35,000"
    |
    v
User reviews and edits
    |
    v
[create_listing] Post to marketplace
```

### 3.5 "Plan a Reunion" Flow

```
[ask_batch] "Which batch year?"
    |
    v
[find_batchmates] Search alumni by batch + school
    |
    v
[analyze_locations] Find geographic center of batchmates
    |
    v
[suggest_dates] Avoid national holidays, suggest 3 weekend options
    |
    v
[create_event] Create reunion event with poll for date/venue
    |
    v
[invite] Notify all batchmates
```

### 3.6 "Weekly Digest" Flow

```
[fetch_new_jobs] Jobs posted in last 7 days
    |
    v
[fetch_events] Upcoming events in next 14 days
    |
    v
[fetch_listings] New marketplace listings
    |
    v
[fetch_posts] Popular forum posts
    |
    v
[summarize] AI creates concise digest
    |
    v
[format_email] HTML email template
    |
    v
[send] Email to subscribed users
```

### 3.7 "Write a Post" Flow

```
[ask_topic] "What do you want to write about?"
    |
    v
[understand_context] Identify category, tone, audience
    |
    v
[generate_draft] Structured post with intro, body, question
    |
    v
[preview] Show draft with edit option
    |
    v
[publish] Post to forum
```

---

## Component 4: Smart Matching / Vector Search (87 hours)

### 4.1 pgvector Setup

```sql
-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding columns
ALTER TABLE profiles ADD COLUMN embedding vector(1536);
ALTER TABLE jobs ADD COLUMN embedding vector(1536);
ALTER TABLE marketplace_listings ADD COLUMN embedding vector(1536);

-- Create HNSW indexes
CREATE INDEX ON profiles USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON jobs USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON marketplace_listings USING hnsw (embedding vector_cosine_ops);
```

### 4.2 Embedding Pipeline

What gets embedded (text constructed from multiple fields):

| Table | Embedding Input |
|---|---|
| profiles | "{full_name} {profession} at {company} in {industry}. Skills: {skills}. {bio}" |
| jobs | "{title} at {company}. {description}. Skills: {skills}. {job_type} in {location}" |
| listings | "{title}. {description}. Category: {category}. Condition: {condition}" |

Embeddings are generated:
- On record creation (server action hook)
- On record update (server action hook)
- Batch processing for existing records (one-time migration)

### 4.3 Semantic Search

Natural language queries mapped to vector similarity:
- "alumni who can help with UPSC" -> vector search on profiles
- "remote React developer jobs" -> vector search on jobs
- "used laptop in Bangalore" -> vector search on listings

Hybrid search: combine FTS score (keyword match) + vector score (semantic match).

### 4.4 Recommendation UI

- Dashboard: "Jobs for You" (top 3 matching jobs)
- Dashboard: "Suggested Mentors" (top 3 compatible mentors)
- Profile page: "Alumni like you" (similar profiles)
- Events page: "Recommended for you" (based on interests/location)

---

## Component 5: AI Content Generation (48 hours)

| Feature | Model | Input | Output |
|---|---|---|---|
| Job description | GPT-4o-mini | Role, company, skills, experience | Professional JD with sections |
| Listing from photo | GPT-4o (vision) | Product image | Title, description, category, price range |
| Profile bio | GPT-4o-mini | Profile fields | 2-3 sentence professional bio |
| Post drafter | GPT-4o-mini | Topic/question | Structured forum post |
| Content summary | GPT-4o-mini | Long text | TL;DR summary |

---

## Component 6: Admin AI Tools (64 hours)

### 6.1 AI Content Moderation

- Auto-review flagged content
- Classify: safe / borderline / violation
- Suggest action with reasoning
- Accuracy tracking (learn from admin corrections)

### 6.2 Natural Language Admin Queries

```
Admin: "How many users joined this month?"
Agent: "142 new users joined in May 2026. That's a 23% increase from April."

Admin: "Show me the most applied jobs this week"
Agent: [table of top 5 jobs with application counts]

Admin: "Approve all pending users from JNV Patna batch 2020"
Agent: "Found 3 pending users matching that criteria. Approve all?" [Confirm]
```

### 6.3 AI Report Generation

Monthly auto-generated report:
- User growth chart
- Feature usage breakdown
- Top content (posts, jobs, events)
- Marketplace stats
- AI-generated insights ("Job postings up 40% — consider adding more job categories")
- Exportable as PDF

---

## LLM Cost Estimates

### Per-Request Costs

| Action | Model | Tokens (~) | Cost |
|---|---|---|---|
| Simple chat query | GPT-4o-mini | ~2K | Rs 0.15 |
| Complex search | GPT-4o-mini | ~4K | Rs 0.30 |
| Job description | GPT-4o | ~3K | Rs 2.50 |
| Image analysis | GPT-4o vision | ~5K | Rs 4.00 |
| Weekly digest | GPT-4o-mini | ~8K | Rs 0.60 |
| Embedding | text-embedding-3-small | ~500 | Rs 0.01 |

### Monthly Cost by Scale

| Users | AI Actions/mo | LLM Cost/mo |
|---|---|---|
| 50 | ~500 | Rs 200-500 |
| 500 | ~5,000 | Rs 2,000-5,000 |
| 2,000 | ~20,000 | Rs 8,000-15,000 |
| 10,000 | ~100,000 | Rs 40,000-80,000 |

### Cost Optimization

| Strategy | Savings |
|---|---|
| GPT-4o-mini for 90% of tasks | 60-70% vs GPT-4o |
| Cache common queries (1hr TTL) | 30-40% |
| Pre-compute embeddings | 50% on search |
| Rate limit (20 AI actions/user/day) | Prevents abuse |
| Batch digest generation | 40% vs individual |

---

## Development Cost

| Component | Hours | Freelancer @ Rs 1,200/hr | Company @ Rs 2,500/hr |
|---|---|---|---|
| Agent Core | 160 | Rs 1,92,000 | Rs 4,00,000 |
| Chat UI | 67 | Rs 80,400 | Rs 1,67,500 |
| Quick Actions (7 flows) | 152 | Rs 1,82,400 | Rs 3,80,000 |
| Smart Matching | 87 | Rs 1,04,400 | Rs 2,17,500 |
| Content Generation | 48 | Rs 57,600 | Rs 1,20,000 |
| Admin AI Tools | 64 | Rs 76,800 | Rs 1,60,000 |
| **TOTAL** | **578 hrs** | **Rs 6,93,600** | **Rs 14,45,000** |

## Implementation Order

1. Agent Core + Chat UI (foundation — everything else depends on this)
2. Search tools + basic chat (immediate value — users can search via conversation)
3. "Find Jobs for Me" + "Find a Mentor" flows (highest user value)
4. Smart Matching with pgvector (powers recommendations)
5. "Post a Job" + "Sell Something" flows (action workflows)
6. Content generation tools (polish)
7. Admin AI tools (operational efficiency)
8. "Plan a Reunion" + "Weekly Digest" (community features)

Start with steps 1-3 for minimum viable AI: ~Rs 2-2.5L, immediate user impact.
