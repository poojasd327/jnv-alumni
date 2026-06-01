-- Performance indexes for JNV Alumni Network
-- Run this migration in your Supabase SQL Editor or via supabase db push
-- These indexes are based on actual query patterns across all server actions.

-- =============================================================================
-- PROFILES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_approval_status
  ON profiles(approval_status);

CREATE INDEX IF NOT EXISTS idx_profiles_approval_status_created_at
  ON profiles(approval_status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_passing_year
  ON profiles(passing_year);

CREATE INDEX IF NOT EXISTS idx_profiles_jnv_state
  ON profiles(jnv_state);

CREATE INDEX IF NOT EXISTS idx_profiles_industry
  ON profiles(industry);

CREATE INDEX IF NOT EXISTS idx_profiles_city
  ON profiles USING btree(city);

-- =============================================================================
-- NOTIFICATIONS (high-traffic — polled on every page load)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_is_read
  ON notifications(user_id, is_read);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id_created_at
  ON notifications(user_id, created_at DESC);

-- =============================================================================
-- MESSAGES & CONVERSATIONS
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_conversations_participant_1
  ON conversations(participant_1);

CREATE INDEX IF NOT EXISTS idx_conversations_participant_2
  ON conversations(participant_2);

CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at
  ON conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id_created_at
  ON messages(conversation_id, created_at);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id_is_read
  ON messages(conversation_id, is_read);

-- =============================================================================
-- JOBS & APPLICATIONS
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_jobs_status
  ON jobs(status);

CREATE INDEX IF NOT EXISTS idx_jobs_posted_by
  ON jobs(posted_by);

CREATE INDEX IF NOT EXISTS idx_jobs_job_type
  ON jobs(job_type);

CREATE INDEX IF NOT EXISTS idx_job_applications_job_id_applicant_id
  ON job_applications(job_id, applicant_id);

CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id
  ON job_applications(applicant_id);

-- =============================================================================
-- EVENTS & REGISTRATIONS
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_events_status
  ON events(status);

CREATE INDEX IF NOT EXISTS idx_events_event_date
  ON events(event_date);

CREATE INDEX IF NOT EXISTS idx_events_organizer_id
  ON events(organizer_id);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id_user_id
  ON event_registrations(event_id, user_id);

CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id
  ON event_registrations(user_id);

-- =============================================================================
-- MARKETPLACE
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status_created_at
  ON marketplace_listings(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_marketplace_listings_seller_id
  ON marketplace_listings(seller_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_listings_category_id
  ON marketplace_listings(category_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_listings_price
  ON marketplace_listings(price);

CREATE INDEX IF NOT EXISTS idx_wishlists_user_id_listing_id
  ON wishlists(user_id, listing_id);

-- =============================================================================
-- FORUM
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_forum_posts_category_id
  ON forum_posts(category_id);

CREATE INDEX IF NOT EXISTS idx_forum_posts_is_pinned_created_at
  ON forum_posts(is_pinned DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_forum_comments_post_id
  ON forum_comments(post_id);

CREATE INDEX IF NOT EXISTS idx_forum_likes_user_id_post_id
  ON forum_likes(user_id, post_id);

-- =============================================================================
-- ANNOUNCEMENTS
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_announcements_is_pinned_created_at
  ON announcements(is_pinned DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_announcements_type
  ON announcements(type);

-- =============================================================================
-- REPORTS (admin)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_reports_status_created_at
  ON reports(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reports_reporter_content
  ON reports(reporter_id, content_type, content_id);

-- =============================================================================
-- MENTORSHIP
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_mentorship_requests_mentor_id
  ON mentorship_requests(mentor_id);

CREATE INDEX IF NOT EXISTS idx_mentorship_requests_mentee_id
  ON mentorship_requests(mentee_id);

-- =============================================================================
-- MEDIA
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_media_category
  ON media(category);

CREATE INDEX IF NOT EXISTS idx_media_uploaded_by
  ON media(uploaded_by);

-- =============================================================================
-- BUSINESSES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_businesses_category
  ON businesses(category);

CREATE INDEX IF NOT EXISTS idx_businesses_owner_id
  ON businesses(owner_id);
