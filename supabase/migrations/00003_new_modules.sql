-- ============================================================
-- JNV Alumni Network - New Modules Migration
-- Jobs, Events, Announcements, Businesses, Forum, Media, Mentorship
-- Run this in Supabase SQL Editor AFTER 00001 and 00002
-- ============================================================

-- ==================== ENUMS ====================
CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'contract', 'internship', 'freelance');
CREATE TYPE job_status AS ENUM ('open', 'closed', 'filled');
CREATE TYPE application_status AS ENUM ('applied', 'under_review', 'interview', 'selected', 'rejected');
CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE announcement_type AS ENUM ('general', 'achievement', 'opportunity', 'update');
CREATE TYPE mentorship_status AS ENUM ('pending', 'accepted', 'active', 'completed', 'declined');

-- ============================================================
-- 1. JOBS MODULE
-- ============================================================

-- ==================== JOBS TABLE ====================
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  location_city TEXT,
  location_state TEXT,
  job_type job_type NOT NULL,
  experience_min INTEGER DEFAULT 0,
  experience_max INTEGER,
  salary_min NUMERIC(12, 2),
  salary_max NUMERIC(12, 2),
  skills_required TEXT[] DEFAULT '{}',
  referral_available BOOLEAN DEFAULT FALSE,
  contact_email TEXT,
  apply_url TEXT,
  status job_status DEFAULT 'open' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for jobs
CREATE INDEX idx_jobs_posted_by ON public.jobs(posted_by);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_job_type ON public.jobs(job_type);
CREATE INDEX idx_jobs_location ON public.jobs(location_city, location_state);
CREATE INDEX idx_jobs_skills ON public.jobs USING GIN(skills_required);
CREATE INDEX idx_jobs_created ON public.jobs(created_at DESC);

-- Full-text search for jobs
ALTER TABLE public.jobs ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(company, '') || ' ' ||
      coalesce(description, '')
    )
  ) STORED;
CREATE INDEX idx_jobs_fts ON public.jobs USING GIN(fts);

-- Auto-update updated_at trigger
CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==================== JOB APPLICATIONS TABLE ====================
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  resume_url TEXT,
  cover_note TEXT,
  status application_status DEFAULT 'applied' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(job_id, applicant_id)
);

-- Indexes for job_applications
CREATE INDEX idx_job_applications_job ON public.job_applications(job_id);
CREATE INDEX idx_job_applications_applicant ON public.job_applications(applicant_id);
CREATE INDEX idx_job_applications_status ON public.job_applications(status);

-- Auto-update updated_at trigger
CREATE TRIGGER job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 2. EVENTS MODULE
-- ============================================================

-- ==================== EVENTS TABLE ====================
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  venue TEXT,
  location_city TEXT,
  location_state TEXT,
  is_online BOOLEAN DEFAULT FALSE,
  meeting_url TEXT,
  images TEXT[] DEFAULT '{}',
  max_attendees INTEGER,
  status event_status DEFAULT 'upcoming' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for events
CREATE INDEX idx_events_organizer ON public.events(organizer_id);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_event_date ON public.events(event_date);
CREATE INDEX idx_events_location ON public.events(location_city, location_state);
CREATE INDEX idx_events_created ON public.events(created_at DESC);

-- Full-text search for events
ALTER TABLE public.events ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(venue, '') || ' ' ||
      coalesce(location_city, '')
    )
  ) STORED;
CREATE INDEX idx_events_fts ON public.events USING GIN(fts);

-- Auto-update updated_at trigger
CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==================== EVENT REGISTRATIONS TABLE ====================
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(event_id, user_id)
);

-- Indexes for event_registrations
CREATE INDEX idx_event_registrations_event ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_user ON public.event_registrations(user_id);

-- ============================================================
-- 3. ANNOUNCEMENTS MODULE
-- ============================================================

-- ==================== ANNOUNCEMENTS TABLE ====================
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type announcement_type DEFAULT 'general' NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for announcements
CREATE INDEX idx_announcements_author ON public.announcements(author_id);
CREATE INDEX idx_announcements_type ON public.announcements(type);
CREATE INDEX idx_announcements_pinned ON public.announcements(is_pinned) WHERE is_pinned = TRUE;
CREATE INDEX idx_announcements_created ON public.announcements(created_at DESC);

-- Full-text search for announcements
ALTER TABLE public.announcements ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(content, '')
    )
  ) STORED;
CREATE INDEX idx_announcements_fts ON public.announcements USING GIN(fts);

-- Auto-update updated_at trigger
CREATE TRIGGER announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 4. BUSINESSES MODULE
-- ============================================================

-- ==================== BUSINESSES TABLE ====================
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  services TEXT[] DEFAULT '{}',
  location_city TEXT,
  location_state TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for businesses
CREATE INDEX idx_businesses_owner ON public.businesses(owner_id);
CREATE INDEX idx_businesses_category ON public.businesses(category);
CREATE INDEX idx_businesses_location ON public.businesses(location_city, location_state);
CREATE INDEX idx_businesses_verified ON public.businesses(is_verified) WHERE is_verified = TRUE;
CREATE INDEX idx_businesses_services ON public.businesses USING GIN(services);
CREATE INDEX idx_businesses_created ON public.businesses(created_at DESC);

-- Full-text search for businesses
ALTER TABLE public.businesses ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(name, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(category, '') || ' ' ||
      coalesce(location_city, '')
    )
  ) STORED;
CREATE INDEX idx_businesses_fts ON public.businesses USING GIN(fts);

-- Auto-update updated_at trigger
CREATE TRIGGER businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 5. FORUM MODULE
-- ============================================================

-- ==================== FORUM CATEGORIES TABLE ====================
CREATE TABLE public.forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==================== FORUM POSTS TABLE ====================
CREATE TABLE public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.forum_categories(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for forum_posts
CREATE INDEX idx_forum_posts_category ON public.forum_posts(category_id);
CREATE INDEX idx_forum_posts_author ON public.forum_posts(author_id);
CREATE INDEX idx_forum_posts_pinned ON public.forum_posts(is_pinned) WHERE is_pinned = TRUE;
CREATE INDEX idx_forum_posts_created ON public.forum_posts(created_at DESC);

-- Full-text search for forum_posts
ALTER TABLE public.forum_posts ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(content, '')
    )
  ) STORED;
CREATE INDEX idx_forum_posts_fts ON public.forum_posts USING GIN(fts);

-- Auto-update updated_at trigger
CREATE TRIGGER forum_posts_updated_at
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==================== FORUM COMMENTS TABLE ====================
CREATE TABLE public.forum_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.forum_comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for forum_comments
CREATE INDEX idx_forum_comments_post ON public.forum_comments(post_id);
CREATE INDEX idx_forum_comments_author ON public.forum_comments(author_id);
CREATE INDEX idx_forum_comments_parent ON public.forum_comments(parent_id);
CREATE INDEX idx_forum_comments_created ON public.forum_comments(created_at DESC);

-- Auto-update updated_at trigger
CREATE TRIGGER forum_comments_updated_at
  BEFORE UPDATE ON public.forum_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==================== FORUM LIKES TABLE ====================
CREATE TABLE public.forum_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.forum_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  -- Exactly one of post_id or comment_id must be non-null
  CONSTRAINT forum_likes_target_check CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR
    (post_id IS NULL AND comment_id IS NOT NULL)
  )
);

-- Unique partial indexes to enforce one like per user per target
CREATE UNIQUE INDEX idx_forum_likes_user_post ON public.forum_likes(user_id, post_id) WHERE post_id IS NOT NULL;
CREATE UNIQUE INDEX idx_forum_likes_user_comment ON public.forum_likes(user_id, comment_id) WHERE comment_id IS NOT NULL;

-- Additional indexes for forum_likes
CREATE INDEX idx_forum_likes_post ON public.forum_likes(post_id) WHERE post_id IS NOT NULL;
CREATE INDEX idx_forum_likes_comment ON public.forum_likes(comment_id) WHERE comment_id IS NOT NULL;

-- ============================================================
-- 6. MEDIA MODULE
-- ============================================================

-- ==================== MEDIA TABLE ====================
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  category TEXT,
  batch_year INTEGER,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for media
CREATE INDEX idx_media_uploaded_by ON public.media(uploaded_by);
CREATE INDEX idx_media_file_type ON public.media(file_type);
CREATE INDEX idx_media_category ON public.media(category);
CREATE INDEX idx_media_batch_year ON public.media(batch_year);
CREATE INDEX idx_media_event ON public.media(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX idx_media_tags ON public.media USING GIN(tags);
CREATE INDEX idx_media_created ON public.media(created_at DESC);

-- Full-text search for media
ALTER TABLE public.media ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(category, '')
    )
  ) STORED;
CREATE INDEX idx_media_fts ON public.media USING GIN(fts);

-- ============================================================
-- 7. MENTORSHIP MODULE
-- ============================================================

-- ==================== MENTORSHIP REQUESTS TABLE ====================
CREATE TABLE public.mentorship_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  area TEXT NOT NULL,
  message TEXT,
  status mentorship_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(mentor_id, mentee_id)
);

-- Indexes for mentorship_requests
CREATE INDEX idx_mentorship_mentor ON public.mentorship_requests(mentor_id);
CREATE INDEX idx_mentorship_mentee ON public.mentorship_requests(mentee_id);
CREATE INDEX idx_mentorship_status ON public.mentorship_requests(status);
CREATE INDEX idx_mentorship_area ON public.mentorship_requests(area);
CREATE INDEX idx_mentorship_created ON public.mentorship_requests(created_at DESC);

-- Auto-update updated_at trigger
CREATE TRIGGER mentorship_requests_updated_at
  BEFORE UPDATE ON public.mentorship_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY - ALL NEW TABLES
-- ============================================================

-- Enable RLS on all new tables
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;

-- ==================== JOBS RLS ====================

CREATE POLICY "Open jobs viewable by authenticated"
  ON public.jobs FOR SELECT TO authenticated
  USING (status = 'open' OR posted_by = auth.uid());

CREATE POLICY "Approved alumni can post jobs"
  ON public.jobs FOR INSERT TO authenticated
  WITH CHECK (
    posted_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND approval_status = 'approved'
    )
  );

CREATE POLICY "Posters can update own jobs"
  ON public.jobs FOR UPDATE TO authenticated
  USING (posted_by = auth.uid())
  WITH CHECK (posted_by = auth.uid());

CREATE POLICY "Posters can delete own jobs"
  ON public.jobs FOR DELETE TO authenticated
  USING (posted_by = auth.uid());

CREATE POLICY "Admins can manage all jobs"
  ON public.jobs FOR ALL TO authenticated
  USING (public.is_admin());

-- ==================== JOB APPLICATIONS RLS ====================

CREATE POLICY "Applicants can view own applications"
  ON public.job_applications FOR SELECT TO authenticated
  USING (applicant_id = auth.uid());

CREATE POLICY "Job posters can view applications for their jobs"
  ON public.job_applications FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = job_applications.job_id AND jobs.posted_by = auth.uid()
    )
  );

CREATE POLICY "Approved alumni can apply to jobs"
  ON public.job_applications FOR INSERT TO authenticated
  WITH CHECK (
    applicant_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND approval_status = 'approved'
    )
  );

CREATE POLICY "Applicants can update own applications"
  ON public.job_applications FOR UPDATE TO authenticated
  USING (applicant_id = auth.uid())
  WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Job posters can update application status"
  ON public.job_applications FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = job_applications.job_id AND jobs.posted_by = auth.uid()
    )
  );

CREATE POLICY "Applicants can delete own applications"
  ON public.job_applications FOR DELETE TO authenticated
  USING (applicant_id = auth.uid());

CREATE POLICY "Admins can manage all applications"
  ON public.job_applications FOR ALL TO authenticated
  USING (public.is_admin());

-- ==================== EVENTS RLS ====================

CREATE POLICY "Events viewable by authenticated"
  ON public.events FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "Approved alumni can create events"
  ON public.events FOR INSERT TO authenticated
  WITH CHECK (
    organizer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND approval_status = 'approved'
    )
  );

CREATE POLICY "Organizers can update own events"
  ON public.events FOR UPDATE TO authenticated
  USING (organizer_id = auth.uid())
  WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Organizers can delete own events"
  ON public.events FOR DELETE TO authenticated
  USING (organizer_id = auth.uid());

CREATE POLICY "Admins can manage all events"
  ON public.events FOR ALL TO authenticated
  USING (public.is_admin());

-- ==================== EVENT REGISTRATIONS RLS ====================

CREATE POLICY "Users can view own registrations"
  ON public.event_registrations FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Organizers can view registrations for their events"
  ON public.event_registrations FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_registrations.event_id AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can register for events"
  ON public.event_registrations FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can cancel own registration"
  ON public.event_registrations FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all registrations"
  ON public.event_registrations FOR ALL TO authenticated
  USING (public.is_admin());

-- ==================== ANNOUNCEMENTS RLS ====================

CREATE POLICY "Announcements viewable by authenticated"
  ON public.announcements FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "Approved alumni can create announcements"
  ON public.announcements FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND approval_status = 'approved'
    )
  );

CREATE POLICY "Authors can update own announcements"
  ON public.announcements FOR UPDATE TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can delete own announcements"
  ON public.announcements FOR DELETE TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all announcements"
  ON public.announcements FOR ALL TO authenticated
  USING (public.is_admin());

-- ==================== BUSINESSES RLS ====================

CREATE POLICY "Businesses viewable by authenticated"
  ON public.businesses FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "Approved alumni can list businesses"
  ON public.businesses FOR INSERT TO authenticated
  WITH CHECK (
    owner_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND approval_status = 'approved'
    )
  );

CREATE POLICY "Owners can update own businesses"
  ON public.businesses FOR UPDATE TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can delete own businesses"
  ON public.businesses FOR DELETE TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Admins can manage all businesses"
  ON public.businesses FOR ALL TO authenticated
  USING (public.is_admin());

-- ==================== FORUM CATEGORIES RLS ====================

CREATE POLICY "Forum categories viewable by authenticated"
  ON public.forum_categories FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "Admins can manage forum categories"
  ON public.forum_categories FOR ALL TO authenticated
  USING (public.is_admin());

-- ==================== FORUM POSTS RLS ====================

CREATE POLICY "Forum posts viewable by authenticated"
  ON public.forum_posts FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "Approved alumni can create forum posts"
  ON public.forum_posts FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND approval_status = 'approved'
    )
  );

CREATE POLICY "Authors can update own forum posts"
  ON public.forum_posts FOR UPDATE TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can delete own forum posts"
  ON public.forum_posts FOR DELETE TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all forum posts"
  ON public.forum_posts FOR ALL TO authenticated
  USING (public.is_admin());

-- ==================== FORUM COMMENTS RLS ====================

CREATE POLICY "Forum comments viewable by authenticated"
  ON public.forum_comments FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "Approved alumni can create forum comments"
  ON public.forum_comments FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND approval_status = 'approved'
    )
  );

CREATE POLICY "Authors can update own forum comments"
  ON public.forum_comments FOR UPDATE TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can delete own forum comments"
  ON public.forum_comments FOR DELETE TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all forum comments"
  ON public.forum_comments FOR ALL TO authenticated
  USING (public.is_admin());

-- ==================== FORUM LIKES RLS ====================

CREATE POLICY "Forum likes viewable by authenticated"
  ON public.forum_likes FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "Authenticated users can like"
  ON public.forum_likes FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove own likes"
  ON public.forum_likes FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ==================== MEDIA RLS ====================

CREATE POLICY "Media viewable by authenticated"
  ON public.media FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "Approved alumni can upload media"
  ON public.media FOR INSERT TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND approval_status = 'approved'
    )
  );

CREATE POLICY "Uploaders can update own media"
  ON public.media FOR UPDATE TO authenticated
  USING (uploaded_by = auth.uid());

CREATE POLICY "Uploaders can delete own media"
  ON public.media FOR DELETE TO authenticated
  USING (uploaded_by = auth.uid());

CREATE POLICY "Admins can manage all media"
  ON public.media FOR ALL TO authenticated
  USING (public.is_admin());

-- ==================== MENTORSHIP REQUESTS RLS ====================

CREATE POLICY "Users can view mentorship requests they are part of"
  ON public.mentorship_requests FOR SELECT TO authenticated
  USING (mentor_id = auth.uid() OR mentee_id = auth.uid());

CREATE POLICY "Approved alumni can send mentorship requests"
  ON public.mentorship_requests FOR INSERT TO authenticated
  WITH CHECK (
    mentee_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND approval_status = 'approved'
    )
  );

CREATE POLICY "Mentors can update request status"
  ON public.mentorship_requests FOR UPDATE TO authenticated
  USING (mentor_id = auth.uid());

CREATE POLICY "Mentees can update own requests"
  ON public.mentorship_requests FOR UPDATE TO authenticated
  USING (mentee_id = auth.uid());

CREATE POLICY "Mentees can cancel own requests"
  ON public.mentorship_requests FOR DELETE TO authenticated
  USING (mentee_id = auth.uid());

CREATE POLICY "Admins can manage all mentorship requests"
  ON public.mentorship_requests FOR ALL TO authenticated
  USING (public.is_admin());

-- ============================================================
-- STORAGE BUCKET - MEDIA
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('media', 'media', TRUE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4']);

-- Storage policies for media bucket
CREATE POLICY "Authenticated users can upload media files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::TEXT);

CREATE POLICY "Users can update own media files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::TEXT);

CREATE POLICY "Users can delete own media files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::TEXT);

CREATE POLICY "Media files are publicly readable"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'media');

-- ============================================================
-- SEED DATA - FORUM CATEGORIES
-- ============================================================

INSERT INTO public.forum_categories (name, slug, description, icon, sort_order) VALUES
  ('Jobs & Careers', 'jobs-careers', 'Discussion about jobs and career guidance', 'Briefcase', 1),
  ('Business & Entrepreneurship', 'business', 'Business ideas, partnerships, leads', 'TrendingUp', 2),
  ('Real Estate', 'real-estate', 'Property discussions', 'Home', 3),
  ('Agriculture', 'agriculture', 'Farming, agri-business discussions', 'Wheat', 4),
  ('Technology', 'technology', 'Tech discussions and help', 'Laptop', 5),
  ('School Memories', 'school-memories', 'Nostalgic moments and memories', 'Heart', 6),
  ('General', 'general', 'Everything else', 'MessageCircle', 7);
