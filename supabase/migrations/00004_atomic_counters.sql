-- ============================================================
-- Atomic counter functions for forum posts
-- Prevents race conditions with concurrent users
-- Run this in Supabase SQL Editor AFTER 00003
-- ============================================================

-- Atomic increment for view_count
CREATE OR REPLACE FUNCTION public.increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.forum_posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic increment/decrement for likes_count
CREATE OR REPLACE FUNCTION public.update_likes_count(post_id UUID, delta INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE public.forum_posts
  SET likes_count = GREATEST(0, likes_count + delta)
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic increment for comments_count
CREATE OR REPLACE FUNCTION public.increment_comments_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.forum_posts
  SET comments_count = comments_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic increment for marketplace listing view_count
CREATE OR REPLACE FUNCTION public.increment_listing_view_count(listing_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.marketplace_listings
  SET view_count = view_count + 1
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
