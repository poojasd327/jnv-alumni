-- ============================================================
-- JNV Alumni Network Platform - Complete Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- ==================== ENUMS ====================
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE user_role AS ENUM ('alumni', 'admin');
CREATE TYPE listing_status AS ENUM ('active', 'sold', 'inactive', 'deleted');
CREATE TYPE listing_condition AS ENUM ('new', 'like_new', 'good', 'fair');

-- ==================== UTILITY FUNCTIONS ====================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==================== PROFILES TABLE ====================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  mobile TEXT NOT NULL,
  batch_start_year INTEGER NOT NULL,
  passing_year INTEGER NOT NULL,
  jnv_school TEXT NOT NULL,
  jnv_state TEXT NOT NULL,
  city TEXT,
  state TEXT,
  profession TEXT,
  company TEXT,
  industry TEXT,
  skills TEXT[] DEFAULT '{}',
  linkedin_url TEXT,
  portfolio_url TEXT,
  whatsapp_number TEXT,
  bio TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'alumni' NOT NULL,
  approval_status approval_status DEFAULT 'pending' NOT NULL,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  is_profile_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for profiles
CREATE INDEX idx_profiles_approval_status ON public.profiles(approval_status);
CREATE INDEX idx_profiles_jnv_school ON public.profiles(jnv_school);
CREATE INDEX idx_profiles_passing_year ON public.profiles(passing_year);
CREATE INDEX idx_profiles_city ON public.profiles(city);
CREATE INDEX idx_profiles_industry ON public.profiles(industry);
CREATE INDEX idx_profiles_skills ON public.profiles USING GIN(skills);

-- Full-text search for profiles
ALTER TABLE public.profiles ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(full_name, '') || ' ' ||
      coalesce(profession, '') || ' ' ||
      coalesce(company, '') || ' ' ||
      coalesce(bio, '') || ' ' ||
      coalesce(city, '')
    )
  ) STORED;
CREATE INDEX idx_profiles_fts ON public.profiles USING GIN(fts);

-- Auto-update updated_at trigger
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, full_name, mobile,
    batch_start_year, passing_year, jnv_school, jnv_state
  )
  VALUES (
    NEW.id,
    NEW.email,
    coalesce(NEW.raw_user_meta_data->>'full_name', ''),
    coalesce(NEW.raw_user_meta_data->>'mobile', ''),
    coalesce((NEW.raw_user_meta_data->>'batch_start_year')::INTEGER, 0),
    coalesce((NEW.raw_user_meta_data->>'passing_year')::INTEGER, 0),
    coalesce(NEW.raw_user_meta_data->>'jnv_school', ''),
    coalesce(NEW.raw_user_meta_data->>'jnv_state', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ==================== MARKETPLACE CATEGORIES ====================
CREATE TABLE public.marketplace_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.marketplace_subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.marketplace_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(category_id, slug)
);

CREATE INDEX idx_subcategories_category ON public.marketplace_subcategories(category_id);

-- ==================== MARKETPLACE LISTINGS ====================
CREATE TABLE public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.marketplace_categories(id),
  subcategory_id UUID REFERENCES public.marketplace_subcategories(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  price_negotiable BOOLEAN DEFAULT FALSE,
  condition listing_condition DEFAULT 'good',
  location_city TEXT NOT NULL,
  location_state TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  status listing_status DEFAULT 'active' NOT NULL,
  seller_name TEXT NOT NULL,
  seller_avatar_url TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for listings
CREATE INDEX idx_listings_seller ON public.marketplace_listings(seller_id);
CREATE INDEX idx_listings_category ON public.marketplace_listings(category_id);
CREATE INDEX idx_listings_subcategory ON public.marketplace_listings(subcategory_id);
CREATE INDEX idx_listings_status ON public.marketplace_listings(status);
CREATE INDEX idx_listings_location ON public.marketplace_listings(location_city, location_state);
CREATE INDEX idx_listings_price ON public.marketplace_listings(price);
CREATE INDEX idx_listings_created ON public.marketplace_listings(created_at DESC);

-- Full-text search for listings
ALTER TABLE public.marketplace_listings ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(location_city, '')
    )
  ) STORED;
CREATE INDEX idx_listings_fts ON public.marketplace_listings USING GIN(fts);

CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON public.marketplace_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==================== WISHLISTS ====================
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, listing_id)
);

CREATE INDEX idx_wishlists_user ON public.wishlists(user_id);
CREATE INDEX idx_wishlists_listing ON public.wishlists(listing_id);

-- ==================== ROW LEVEL SECURITY ====================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can view approved profiles or own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (approval_status = 'approved' OR id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- MARKETPLACE CATEGORIES (read-only for all authenticated)
CREATE POLICY "Categories viewable by authenticated"
  ON public.marketplace_categories FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "Subcategories viewable by authenticated"
  ON public.marketplace_subcategories FOR SELECT TO authenticated
  USING (TRUE);

-- MARKETPLACE LISTINGS
CREATE POLICY "Active listings viewable by authenticated"
  ON public.marketplace_listings FOR SELECT TO authenticated
  USING (status = 'active' OR seller_id = auth.uid());

CREATE POLICY "Approved alumni can create listings"
  ON public.marketplace_listings FOR INSERT TO authenticated
  WITH CHECK (
    seller_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND approval_status = 'approved'
    )
  );

CREATE POLICY "Sellers can update own listings"
  ON public.marketplace_listings FOR UPDATE TO authenticated
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can delete own listings"
  ON public.marketplace_listings FOR DELETE TO authenticated
  USING (seller_id = auth.uid());

-- WISHLISTS
CREATE POLICY "Users can view own wishlist"
  ON public.wishlists FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can add to wishlist"
  ON public.wishlists FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove from wishlist"
  ON public.wishlists FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ==================== STORAGE BUCKETS ====================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', TRUE, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('marketplace-images', 'marketplace-images', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Storage policies
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::TEXT);

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::TEXT);

CREATE POLICY "Avatar images are publicly readable"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload marketplace images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'marketplace-images' AND (storage.foldername(name))[1] = auth.uid()::TEXT);

CREATE POLICY "Users can delete own marketplace images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'marketplace-images' AND (storage.foldername(name))[1] = auth.uid()::TEXT);

CREATE POLICY "Marketplace images are publicly readable"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'marketplace-images');

-- ==================== SEED DATA ====================

-- Marketplace categories
INSERT INTO public.marketplace_categories (name, slug, icon, sort_order) VALUES
  ('Electronics', 'electronics', 'Smartphone', 1),
  ('Vehicles', 'vehicles', 'Car', 2),
  ('Real Estate', 'real-estate', 'Home', 3),
  ('Agriculture', 'agriculture', 'Wheat', 4),
  ('Services', 'services', 'Briefcase', 5);

-- Subcategories
WITH cats AS (SELECT id, name FROM public.marketplace_categories)
INSERT INTO public.marketplace_subcategories (category_id, name, slug, sort_order)
SELECT c.id, v.name, v.slug, v.sort_order
FROM cats c
JOIN (VALUES
  ('Electronics', 'Phones', 'phones', 1),
  ('Electronics', 'Laptops', 'laptops', 2),
  ('Electronics', 'Tablets', 'tablets', 3),
  ('Electronics', 'Other Electronics', 'other-electronics', 4),
  ('Vehicles', 'Cars', 'cars', 1),
  ('Vehicles', 'Bikes', 'bikes', 2),
  ('Vehicles', 'Other Vehicles', 'other-vehicles', 3),
  ('Real Estate', 'Flats', 'flats', 1),
  ('Real Estate', 'Plots', 'plots', 2),
  ('Real Estate', 'Lands', 'lands', 3),
  ('Real Estate', 'Commercial', 'commercial', 4),
  ('Agriculture', 'Produce', 'produce', 1),
  ('Agriculture', 'Equipment', 'equipment', 2),
  ('Agriculture', 'Estates', 'estates', 3),
  ('Services', 'Consultants', 'consultants', 1),
  ('Services', 'Trainers', 'trainers', 2),
  ('Services', 'Contractors', 'contractors', 3),
  ('Services', 'Other Services', 'other-services', 4)
) AS v(cat_name, name, slug, sort_order) ON c.name = v.cat_name;
