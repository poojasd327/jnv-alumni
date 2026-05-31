-- ============================================================
-- JNV Alumni Network - Comprehensive Seed Data
-- Run this in Supabase SQL Editor AFTER running all migrations
-- All seed users have password: Alumni@123
-- ============================================================

DO $$
DECLARE
  -- ======================== USER IDs ========================
  admin_id UUID := gen_random_uuid();
  u1  UUID := gen_random_uuid();  -- Priya Patel
  u2  UUID := gen_random_uuid();  -- Amit Singh
  u3  UUID := gen_random_uuid();  -- Dr. Sneha Verma
  u4  UUID := gen_random_uuid();  -- Vikram Joshi
  u5  UUID := gen_random_uuid();  -- Ananya Reddy
  u6  UUID := gen_random_uuid();  -- Rahul Mehta
  u7  UUID := gen_random_uuid();  -- Deepika Nair
  u8  UUID := gen_random_uuid();  -- Suresh Yadav
  u9  UUID := gen_random_uuid();  -- Prof. Kavita Mishra
  u10 UUID := gen_random_uuid();  -- Arjun Gupta
  u11 UUID := gen_random_uuid();  -- Pooja Srivastava
  u12 UUID := gen_random_uuid();  -- Manish Tiwari
  u13 UUID := gen_random_uuid();  -- Neha Agarwal
  u14 UUID := gen_random_uuid();  -- Sanjay Dubey
  u15 UUID := gen_random_uuid();  -- Arun Prakash

  -- ======================== FORUM CATEGORY IDs ========================
  fc_jobs       UUID;
  fc_business   UUID;
  fc_realestate UUID;
  fc_agriculture UUID;
  fc_technology UUID;
  fc_memories   UUID;
  fc_general    UUID;

  -- ======================== MARKETPLACE CATEGORY IDs ========================
  mc_electronics UUID;
  mc_vehicles    UUID;
  mc_realestate  UUID;
  mc_agriculture UUID;
  mc_services    UUID;

  -- ======================== MARKETPLACE SUBCATEGORY IDs ========================
  msc_phones     UUID;
  msc_laptops    UUID;
  msc_cars       UUID;
  msc_bikes      UUID;
  msc_flats      UUID;
  msc_plots      UUID;
  msc_produce    UUID;
  msc_equipment  UUID;
  msc_consultants UUID;
  msc_other_electronics UUID;
  msc_tablets    UUID;
  msc_other_vehicles UUID;

  -- ======================== ITEM IDs ========================
  job1  UUID := gen_random_uuid();
  job2  UUID := gen_random_uuid();
  job3  UUID := gen_random_uuid();
  job4  UUID := gen_random_uuid();
  job5  UUID := gen_random_uuid();
  job6  UUID := gen_random_uuid();
  job7  UUID := gen_random_uuid();
  job8  UUID := gen_random_uuid();
  job9  UUID := gen_random_uuid();
  job10 UUID := gen_random_uuid();

  evt1  UUID := gen_random_uuid();
  evt2  UUID := gen_random_uuid();
  evt3  UUID := gen_random_uuid();
  evt4  UUID := gen_random_uuid();
  evt5  UUID := gen_random_uuid();
  evt6  UUID := gen_random_uuid();
  evt7  UUID := gen_random_uuid();
  evt8  UUID := gen_random_uuid();

  fp1   UUID := gen_random_uuid();
  fp2   UUID := gen_random_uuid();
  fp3   UUID := gen_random_uuid();
  fp4   UUID := gen_random_uuid();
  fp5   UUID := gen_random_uuid();
  fp6   UUID := gen_random_uuid();
  fp7   UUID := gen_random_uuid();
  fp8   UUID := gen_random_uuid();
  fp9   UUID := gen_random_uuid();
  fp10  UUID := gen_random_uuid();
  fp11  UUID := gen_random_uuid();
  fp12  UUID := gen_random_uuid();

  fc1   UUID := gen_random_uuid();
  fc2   UUID := gen_random_uuid();
  fc3   UUID := gen_random_uuid();
  fc4   UUID := gen_random_uuid();
  fc5   UUID := gen_random_uuid();
  fc6   UUID := gen_random_uuid();
  fc7   UUID := gen_random_uuid();
  fc8   UUID := gen_random_uuid();
  fc9   UUID := gen_random_uuid();
  fc10  UUID := gen_random_uuid();
  fc11  UUID := gen_random_uuid();
  fc12  UUID := gen_random_uuid();
  fc13  UUID := gen_random_uuid();
  fc14  UUID := gen_random_uuid();
  fc15  UUID := gen_random_uuid();
  fc16  UUID := gen_random_uuid();
  fc17  UUID := gen_random_uuid();
  fc18  UUID := gen_random_uuid();
  fc19  UUID := gen_random_uuid();
  fc20  UUID := gen_random_uuid();

  ann1  UUID := gen_random_uuid();
  ann2  UUID := gen_random_uuid();
  ann3  UUID := gen_random_uuid();
  ann4  UUID := gen_random_uuid();
  ann5  UUID := gen_random_uuid();
  ann6  UUID := gen_random_uuid();
  ann7  UUID := gen_random_uuid();
  ann8  UUID := gen_random_uuid();

  biz1  UUID := gen_random_uuid();
  biz2  UUID := gen_random_uuid();
  biz3  UUID := gen_random_uuid();
  biz4  UUID := gen_random_uuid();
  biz5  UUID := gen_random_uuid();
  biz6  UUID := gen_random_uuid();
  biz7  UUID := gen_random_uuid();
  biz8  UUID := gen_random_uuid();

  ml1   UUID := gen_random_uuid();
  ml2   UUID := gen_random_uuid();
  ml3   UUID := gen_random_uuid();
  ml4   UUID := gen_random_uuid();
  ml5   UUID := gen_random_uuid();
  ml6   UUID := gen_random_uuid();
  ml7   UUID := gen_random_uuid();
  ml8   UUID := gen_random_uuid();
  ml9   UUID := gen_random_uuid();
  ml10  UUID := gen_random_uuid();
  ml11  UUID := gen_random_uuid();
  ml12  UUID := gen_random_uuid();
  ml13  UUID := gen_random_uuid();
  ml14  UUID := gen_random_uuid();
  ml15  UUID := gen_random_uuid();
  ml16  UUID := gen_random_uuid();

  med1  UUID := gen_random_uuid();
  med2  UUID := gen_random_uuid();
  med3  UUID := gen_random_uuid();
  med4  UUID := gen_random_uuid();
  med5  UUID := gen_random_uuid();
  med6  UUID := gen_random_uuid();
  med7  UUID := gen_random_uuid();
  med8  UUID := gen_random_uuid();

  enc_pw TEXT := crypt('Alumni@123', gen_salt('bf'));

  -- List of all seed user emails (used for cleanup)
  seed_emails TEXT[] := ARRAY[
    'admin@jnvalumni.org',
    'priya.patel@example.com',
    'amit.singh@example.com',
    'sneha.verma@example.com',
    'vikram.joshi@example.com',
    'ananya.reddy@example.com',
    'rahul.mehta@example.com',
    'deepika.nair@example.com',
    'suresh.yadav@example.com',
    'kavita.mishra@example.com',
    'arjun.gupta@example.com',
    'pooja.srivastava@example.com',
    'manish.tiwari@example.com',
    'neha.agarwal@example.com',
    'sanjay.dubey@example.com',
    'arun.prakash@example.com'
  ];

BEGIN

  -- ============================================================
  -- 0. CLEANUP PREVIOUSLY SEEDED DATA (safe to re-run)
  -- ============================================================

  -- Remove forum interactions on seed-user posts first
  DELETE FROM forum_likes WHERE user_id IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails))
    OR post_id IN (SELECT id FROM forum_posts WHERE author_id IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails)));

  DELETE FROM forum_comments WHERE author_id IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails))
    OR post_id IN (SELECT id FROM forum_posts WHERE author_id IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails)));

  DELETE FROM forum_posts WHERE author_id IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails));

  -- Remove marketplace interactions on seed-user listings
  DELETE FROM wishlists WHERE user_id IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails))
    OR listing_id IN (SELECT id FROM marketplace_listings WHERE seller_id IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails)));

  DELETE FROM marketplace_listings WHERE seller_id IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails));

  -- Remove job interactions on seed-user jobs
  DELETE FROM job_applications WHERE applicant_id IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails))
    OR job_id IN (SELECT id FROM jobs WHERE posted_by IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails)));

  DELETE FROM jobs WHERE posted_by IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails));

  -- Remove event interactions on seed-user events
  DELETE FROM event_registrations WHERE user_id IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails))
    OR event_id IN (SELECT id FROM events WHERE organizer_id IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails)));

  DELETE FROM events WHERE organizer_id IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails));

  -- Remove remaining seed-user data
  DELETE FROM mentorship_requests WHERE mentor_id IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails))
    OR mentee_id IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails));

  DELETE FROM media WHERE uploaded_by IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails));
  DELETE FROM businesses WHERE owner_id IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails));
  DELETE FROM announcements WHERE author_id IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails));

  -- Clear self-referential FK before deleting profiles
  UPDATE profiles SET approved_by = NULL
    WHERE approved_by IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails));

  -- Delete profiles, identities, and auth users
  DELETE FROM profiles WHERE id IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails));
  DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = ANY(seed_emails));
  DELETE FROM auth.users WHERE email = ANY(seed_emails);

  -- ============================================================
  -- 1. CREATE AUTH USERS (trigger auto-creates profiles)
  -- ============================================================

  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES
  -- Admin
  ('00000000-0000-0000-0000-000000000000', admin_id, 'authenticated', 'authenticated', 'admin@jnvalumni.org', enc_pw, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Dr. Rajesh Kumar","mobile":"9876543210","jnv_state":"Bihar","jnv_school":"JNV Nalanda","batch_start_year":1990,"passing_year":1996}'::jsonb, NOW() - INTERVAL '200 days', NOW(), '', '', '', ''),
  -- Alumni
  ('00000000-0000-0000-0000-000000000000', u1,  'authenticated', 'authenticated', 'priya.patel@example.com',     enc_pw, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Priya Patel","mobile":"9876543211","jnv_state":"Gujarat","jnv_school":"JNV Ahmedabad","batch_start_year":2005,"passing_year":2011}'::jsonb,      NOW() - INTERVAL '180 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', u2,  'authenticated', 'authenticated', 'amit.singh@example.com',      enc_pw, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Amit Singh","mobile":"9876543212","jnv_state":"Uttar Pradesh","jnv_school":"JNV Varanasi","batch_start_year":1998,"passing_year":2004}'::jsonb,    NOW() - INTERVAL '170 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', u3,  'authenticated', 'authenticated', 'sneha.verma@example.com',     enc_pw, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Dr. Sneha Verma","mobile":"9876543213","jnv_state":"Madhya Pradesh","jnv_school":"JNV Bhopal","batch_start_year":2003,"passing_year":2009}'::jsonb, NOW() - INTERVAL '160 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', u4,  'authenticated', 'authenticated', 'vikram.joshi@example.com',    enc_pw, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Vikram Joshi","mobile":"9876543214","jnv_state":"Maharashtra","jnv_school":"JNV Pune","batch_start_year":2000,"passing_year":2006}'::jsonb,       NOW() - INTERVAL '150 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', u5,  'authenticated', 'authenticated', 'ananya.reddy@example.com',    enc_pw, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Ananya Reddy","mobile":"9876543215","jnv_state":"Telangana","jnv_school":"JNV Hyderabad","batch_start_year":2008,"passing_year":2014}'::jsonb,     NOW() - INTERVAL '140 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', u6,  'authenticated', 'authenticated', 'rahul.mehta@example.com',     enc_pw, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Rahul Mehta","mobile":"9876543216","jnv_state":"Gujarat","jnv_school":"JNV Rajkot","batch_start_year":2001,"passing_year":2007}'::jsonb,          NOW() - INTERVAL '130 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', u7,  'authenticated', 'authenticated', 'deepika.nair@example.com',    enc_pw, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Deepika Nair","mobile":"9876543217","jnv_state":"Kerala","jnv_school":"JNV Ernakulam","batch_start_year":2002,"passing_year":2008}'::jsonb,       NOW() - INTERVAL '120 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', u8,  'authenticated', 'authenticated', 'suresh.yadav@example.com',    enc_pw, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Suresh Yadav","mobile":"9876543218","jnv_state":"Rajasthan","jnv_school":"JNV Jaipur","batch_start_year":1995,"passing_year":2001}'::jsonb,       NOW() - INTERVAL '110 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', u9,  'authenticated', 'authenticated', 'kavita.mishra@example.com',   enc_pw, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Prof. Kavita Mishra","mobile":"9876543219","jnv_state":"Uttar Pradesh","jnv_school":"JNV Kanpur","batch_start_year":1999,"passing_year":2005}'::jsonb, NOW() - INTERVAL '100 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', u10, 'authenticated', 'authenticated', 'arjun.gupta@example.com',     enc_pw, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Arjun Gupta","mobile":"9876543220","jnv_state":"Chandigarh","jnv_school":"JNV Chandigarh","batch_start_year":2007,"passing_year":2013}'::jsonb,    NOW() - INTERVAL '90 days',  NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', u11, 'authenticated', 'authenticated', 'pooja.srivastava@example.com', enc_pw, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Pooja Srivastava","mobile":"9876543221","jnv_state":"Uttar Pradesh","jnv_school":"JNV Prayagraj","batch_start_year":2000,"passing_year":2006}'::jsonb, NOW() - INTERVAL '85 days', NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', u12, 'authenticated', 'authenticated', 'manish.tiwari@example.com',   enc_pw, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Manish Tiwari","mobile":"9876543222","jnv_state":"Madhya Pradesh","jnv_school":"JNV Indore","batch_start_year":2003,"passing_year":2009}'::jsonb, NOW() - INTERVAL '75 days',  NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', u13, 'authenticated', 'authenticated', 'neha.agarwal@example.com',    enc_pw, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Neha Agarwal","mobile":"9876543223","jnv_state":"West Bengal","jnv_school":"JNV Kolkata","batch_start_year":2006,"passing_year":2012}'::jsonb,     NOW() - INTERVAL '60 days',  NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', u14, 'authenticated', 'authenticated', 'sanjay.dubey@example.com',    enc_pw, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Sanjay Dubey","mobile":"9876543224","jnv_state":"Maharashtra","jnv_school":"JNV Nagpur","batch_start_year":1997,"passing_year":2003}'::jsonb,      NOW() - INTERVAL '50 days',  NOW(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', u15, 'authenticated', 'authenticated', 'arun.prakash@example.com',    enc_pw, NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Arun Prakash","mobile":"9876543225","jnv_state":"Tamil Nadu","jnv_school":"JNV Chennai","batch_start_year":2004,"passing_year":2010}'::jsonb,      NOW() - INTERVAL '40 days',  NOW(), '', '', '', '');

  -- Create auth.identities for all users
  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES
  (gen_random_uuid(), admin_id, jsonb_build_object('sub', admin_id::text, 'email', 'admin@jnvalumni.org'),        'email', admin_id::text, NOW(), NOW() - INTERVAL '200 days', NOW()),
  (gen_random_uuid(), u1,  jsonb_build_object('sub', u1::text,  'email', 'priya.patel@example.com'),      'email', u1::text,  NOW(), NOW() - INTERVAL '180 days', NOW()),
  (gen_random_uuid(), u2,  jsonb_build_object('sub', u2::text,  'email', 'amit.singh@example.com'),       'email', u2::text,  NOW(), NOW() - INTERVAL '170 days', NOW()),
  (gen_random_uuid(), u3,  jsonb_build_object('sub', u3::text,  'email', 'sneha.verma@example.com'),      'email', u3::text,  NOW(), NOW() - INTERVAL '160 days', NOW()),
  (gen_random_uuid(), u4,  jsonb_build_object('sub', u4::text,  'email', 'vikram.joshi@example.com'),     'email', u4::text,  NOW(), NOW() - INTERVAL '150 days', NOW()),
  (gen_random_uuid(), u5,  jsonb_build_object('sub', u5::text,  'email', 'ananya.reddy@example.com'),     'email', u5::text,  NOW(), NOW() - INTERVAL '140 days', NOW()),
  (gen_random_uuid(), u6,  jsonb_build_object('sub', u6::text,  'email', 'rahul.mehta@example.com'),      'email', u6::text,  NOW(), NOW() - INTERVAL '130 days', NOW()),
  (gen_random_uuid(), u7,  jsonb_build_object('sub', u7::text,  'email', 'deepika.nair@example.com'),     'email', u7::text,  NOW(), NOW() - INTERVAL '120 days', NOW()),
  (gen_random_uuid(), u8,  jsonb_build_object('sub', u8::text,  'email', 'suresh.yadav@example.com'),     'email', u8::text,  NOW(), NOW() - INTERVAL '110 days', NOW()),
  (gen_random_uuid(), u9,  jsonb_build_object('sub', u9::text,  'email', 'kavita.mishra@example.com'),    'email', u9::text,  NOW(), NOW() - INTERVAL '100 days', NOW()),
  (gen_random_uuid(), u10, jsonb_build_object('sub', u10::text, 'email', 'arjun.gupta@example.com'),      'email', u10::text, NOW(), NOW() - INTERVAL '90 days', NOW()),
  (gen_random_uuid(), u11, jsonb_build_object('sub', u11::text, 'email', 'pooja.srivastava@example.com'), 'email', u11::text, NOW(), NOW() - INTERVAL '85 days', NOW()),
  (gen_random_uuid(), u12, jsonb_build_object('sub', u12::text, 'email', 'manish.tiwari@example.com'),    'email', u12::text, NOW(), NOW() - INTERVAL '75 days', NOW()),
  (gen_random_uuid(), u13, jsonb_build_object('sub', u13::text, 'email', 'neha.agarwal@example.com'),     'email', u13::text, NOW(), NOW() - INTERVAL '60 days', NOW()),
  (gen_random_uuid(), u14, jsonb_build_object('sub', u14::text, 'email', 'sanjay.dubey@example.com'),     'email', u14::text, NOW(), NOW() - INTERVAL '50 days', NOW()),
  (gen_random_uuid(), u15, jsonb_build_object('sub', u15::text, 'email', 'arun.prakash@example.com'),     'email', u15::text, NOW(), NOW() - INTERVAL '40 days', NOW());


  -- ============================================================
  -- 2. UPDATE PROFILES WITH RICH DATA
  -- ============================================================

  -- Admin - Dr. Rajesh Kumar
  UPDATE profiles SET
    role = 'admin',
    approval_status = 'approved',
    approved_at = NOW() - INTERVAL '199 days',
    city = 'New Delhi', state = 'Delhi',
    profession = 'IAS Officer', company = 'Government of India', industry = 'Government & Public Sector',
    skills = ARRAY['Public Administration', 'Policy Making', 'Leadership', 'Project Management', 'Governance'],
    linkedin_url = 'https://linkedin.com/in/rajeshkumar-ias',
    bio = 'IAS officer (2002 batch) currently serving as Joint Secretary in the Ministry of Rural Development. Passionate about leveraging technology for governance and connecting JNV alumni across India. Founded this platform to bring our community together.',
    whatsapp_number = '9876543210',
    is_profile_complete = true
  WHERE id = admin_id;

  -- Priya Patel - Software Engineer
  UPDATE profiles SET
    approval_status = 'approved', approved_by = admin_id, approved_at = NOW() - INTERVAL '179 days',
    city = 'Bangalore', state = 'Karnataka',
    profession = 'Senior Software Engineer', company = 'Google India', industry = 'Technology',
    skills = ARRAY['JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning', 'TypeScript', 'System Design'],
    linkedin_url = 'https://linkedin.com/in/priyapatel-dev',
    portfolio_url = 'https://priyapatel.dev',
    bio = 'Building scalable web applications at Google. Previously at Flipkart. IIT Bombay CS graduate. Love mentoring junior developers and JNV students preparing for engineering entrance exams.',
    whatsapp_number = '9876543211',
    is_profile_complete = true
  WHERE id = u1;

  -- Amit Singh - IPS Officer
  UPDATE profiles SET
    approval_status = 'approved', approved_by = admin_id, approved_at = NOW() - INTERVAL '169 days',
    city = 'Lucknow', state = 'Uttar Pradesh',
    profession = 'IPS Officer', company = 'Uttar Pradesh Police', industry = 'Government & Public Sector',
    skills = ARRAY['Law Enforcement', 'Crisis Management', 'Leadership', 'Investigation', 'Public Safety'],
    linkedin_url = 'https://linkedin.com/in/amitsingh-ips',
    bio = 'IPS officer (2008 batch) serving as SP in Lucknow. Committed to community policing and youth development. Regular speaker at JNV motivation sessions across UP.',
    whatsapp_number = '9876543212',
    is_profile_complete = true
  WHERE id = u2;

  -- Dr. Sneha Verma - Cardiologist
  UPDATE profiles SET
    approval_status = 'approved', approved_by = admin_id, approved_at = NOW() - INTERVAL '159 days',
    city = 'New Delhi', state = 'Delhi',
    profession = 'Cardiologist', company = 'AIIMS New Delhi', industry = 'Healthcare',
    skills = ARRAY['Cardiology', 'Research', 'Patient Care', 'Medical Education', 'Clinical Trials'],
    linkedin_url = 'https://linkedin.com/in/drsnehaverma',
    bio = 'DM Cardiology from AIIMS. Specializing in interventional cardiology with 50+ published research papers. Conduct free cardiac camps in rural MP every quarter.',
    whatsapp_number = '9876543213',
    is_profile_complete = true
  WHERE id = u3;

  -- Vikram Joshi - Entrepreneur
  UPDATE profiles SET
    approval_status = 'approved', approved_by = admin_id, approved_at = NOW() - INTERVAL '149 days',
    city = 'Mumbai', state = 'Maharashtra',
    profession = 'Founder & CEO', company = 'AgriTech Solutions Pvt Ltd', industry = 'Entrepreneurship',
    skills = ARRAY['Entrepreneurship', 'Agriculture Technology', 'Business Strategy', 'Fundraising', 'Product Management'],
    linkedin_url = 'https://linkedin.com/in/vikramjoshi-agritech',
    portfolio_url = 'https://agritechsolutions.in',
    bio = 'Founded AgriTech Solutions to connect farmers directly with markets using technology. Raised Series A from Sequoia. IIM Ahmedabad alumnus. Employing 120+ people across 5 states.',
    whatsapp_number = '9876543214',
    is_profile_complete = true
  WHERE id = u4;

  -- Ananya Reddy - Data Scientist
  UPDATE profiles SET
    approval_status = 'approved', approved_by = admin_id, approved_at = NOW() - INTERVAL '139 days',
    city = 'Hyderabad', state = 'Telangana',
    profession = 'Senior Data Scientist', company = 'Microsoft India', industry = 'Technology',
    skills = ARRAY['Data Science', 'Python', 'Machine Learning', 'SQL', 'Tableau', 'Deep Learning', 'NLP'],
    linkedin_url = 'https://linkedin.com/in/ananyareddy-ds',
    bio = 'Working on Azure AI at Microsoft. IIIT Hyderabad graduate. Published 3 papers on NLP at top conferences. Passionate about using AI for social good, especially in Indian education.',
    whatsapp_number = '9876543215',
    is_profile_complete = true
  WHERE id = u5;

  -- Rahul Mehta - CA
  UPDATE profiles SET
    approval_status = 'approved', approved_by = admin_id, approved_at = NOW() - INTERVAL '129 days',
    city = 'Mumbai', state = 'Maharashtra',
    profession = 'Chartered Accountant', company = 'Deloitte India', industry = 'Finance & Banking',
    skills = ARRAY['Financial Analysis', 'Taxation', 'Audit', 'GST', 'Corporate Finance', 'IFRS'],
    linkedin_url = 'https://linkedin.com/in/rahulmehta-ca',
    bio = 'Senior Manager at Deloitte Tax Practice. Specialize in international taxation and transfer pricing. Help JNV alumni with financial planning and tax queries pro bono.',
    whatsapp_number = '9876543216',
    is_profile_complete = true
  WHERE id = u6;

  -- Deepika Nair - Advocate
  UPDATE profiles SET
    approval_status = 'approved', approved_by = admin_id, approved_at = NOW() - INTERVAL '119 days',
    city = 'Kochi', state = 'Kerala',
    profession = 'Advocate', company = 'Nair & Associates', industry = 'Legal',
    skills = ARRAY['Civil Law', 'Corporate Law', 'Litigation', 'Legal Research', 'Intellectual Property'],
    linkedin_url = 'https://linkedin.com/in/deepikanair-law',
    bio = 'Practicing advocate at Kerala High Court with 12+ years experience. Specialize in corporate and IP law. Provide free legal aid clinics for underprivileged communities in Kochi.',
    whatsapp_number = '9876543217',
    is_profile_complete = true
  WHERE id = u7;

  -- Suresh Yadav - Agriculture Consultant
  UPDATE profiles SET
    approval_status = 'approved', approved_by = admin_id, approved_at = NOW() - INTERVAL '109 days',
    city = 'Jaipur', state = 'Rajasthan',
    profession = 'Agriculture Consultant', company = 'Self-employed', industry = 'Agriculture',
    skills = ARRAY['Organic Farming', 'Crop Management', 'Irrigation', 'Agribusiness', 'Soil Science'],
    linkedin_url = 'https://linkedin.com/in/sureshyadav-agri',
    bio = 'Agriculture consultant with 20+ years of field experience. Helping 500+ farmers in Rajasthan transition to organic farming. Regular contributor to Krishi Jagran magazine.',
    whatsapp_number = '9876543218',
    is_profile_complete = true
  WHERE id = u8;

  -- Prof. Kavita Mishra - Professor
  UPDATE profiles SET
    approval_status = 'approved', approved_by = admin_id, approved_at = NOW() - INTERVAL '99 days',
    city = 'Kanpur', state = 'Uttar Pradesh',
    profession = 'Professor', company = 'IIT Kanpur', industry = 'Education',
    skills = ARRAY['Teaching', 'Research', 'Computer Science', 'Artificial Intelligence', 'Academic Writing'],
    linkedin_url = 'https://linkedin.com/in/kavitamishra-iitk',
    portfolio_url = 'https://iitk.ac.in/~kavita',
    bio = 'Associate Professor in CSE Department at IIT Kanpur. PhD from IISc Bangalore. Research interests in AI and computational linguistics. Mentor 10+ PhD students.',
    whatsapp_number = '9876543219',
    is_profile_complete = true
  WHERE id = u9;

  -- Arjun Gupta - Full Stack Developer
  UPDATE profiles SET
    approval_status = 'approved', approved_by = admin_id, approved_at = NOW() - INTERVAL '89 days',
    city = 'Gurgaon', state = 'Haryana',
    profession = 'SDE-3', company = 'Amazon India', industry = 'Technology',
    skills = ARRAY['TypeScript', 'React', 'AWS', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes'],
    linkedin_url = 'https://linkedin.com/in/arjungupta-sde',
    portfolio_url = 'https://arjungupta.dev',
    bio = 'SDE-3 at Amazon working on AWS Lambda. Previously at Razorpay. NIT Chandigarh graduate. Open source contributor and tech blogger. Organize coding bootcamps for JNV students.',
    whatsapp_number = '9876543220',
    is_profile_complete = true
  WHERE id = u10;

  -- Pooja Srivastava - IFS Officer
  UPDATE profiles SET
    approval_status = 'approved', approved_by = admin_id, approved_at = NOW() - INTERVAL '84 days',
    city = 'New Delhi', state = 'Delhi',
    profession = 'IFS Officer', company = 'Ministry of External Affairs', industry = 'Government & Public Sector',
    skills = ARRAY['Diplomacy', 'International Relations', 'French', 'Spanish', 'Negotiation', 'Policy Analysis'],
    linkedin_url = 'https://linkedin.com/in/poojasrivastava-ifs',
    bio = 'Indian Foreign Service officer (2010 batch). Posted in Paris and Washington D.C. Currently at MEA headquarters handling bilateral relations with Southeast Asia.',
    whatsapp_number = '9876543221',
    is_profile_complete = true
  WHERE id = u11;

  -- Manish Tiwari - Bank Manager
  UPDATE profiles SET
    approval_status = 'approved', approved_by = admin_id, approved_at = NOW() - INTERVAL '74 days',
    city = 'Bhopal', state = 'Madhya Pradesh',
    profession = 'Branch Manager', company = 'State Bank of India', industry = 'Finance & Banking',
    skills = ARRAY['Banking', 'Finance', 'Team Management', 'Customer Relations', 'Credit Analysis'],
    linkedin_url = 'https://linkedin.com/in/manishtiwari-sbi',
    bio = 'Branch Manager at SBI Bhopal main branch. 14 years in banking. Passionate about financial literacy for rural communities. Conduct workshops on savings and investments for JNV students.',
    whatsapp_number = '9876543222',
    is_profile_complete = true
  WHERE id = u12;

  -- Neha Agarwal - UX Designer
  UPDATE profiles SET
    approval_status = 'approved', approved_by = admin_id, approved_at = NOW() - INTERVAL '59 days',
    city = 'Bangalore', state = 'Karnataka',
    profession = 'Lead UX Designer', company = 'Flipkart', industry = 'Technology',
    skills = ARRAY['UX Design', 'Figma', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility'],
    linkedin_url = 'https://linkedin.com/in/nehaagarwal-ux',
    portfolio_url = 'https://nehaagarwal.design',
    bio = 'Lead UX Designer at Flipkart building commerce experiences for 400M+ users. NID Ahmedabad graduate. Speaker at DesignUp and UX India conferences. Advocate for inclusive design.',
    whatsapp_number = '9876543223',
    is_profile_complete = true
  WHERE id = u13;

  -- Sanjay Dubey - Agripreneur
  UPDATE profiles SET
    approval_status = 'approved', approved_by = admin_id, approved_at = NOW() - INTERVAL '49 days',
    city = 'Nagpur', state = 'Maharashtra',
    profession = 'Agripreneur', company = 'Dubey Organic Farms', industry = 'Agriculture',
    skills = ARRAY['Agriculture', 'Dairy Farming', 'Supply Chain', 'Rural Development', 'Organic Certification'],
    linkedin_url = 'https://linkedin.com/in/sanjaydubey-farms',
    bio = 'Running 50-acre organic farm and dairy in Nagpur. Supply fresh produce to 200+ households through direct-to-consumer model. Won Krishi Samman award 2024 from Maharashtra Government.',
    whatsapp_number = '9876543224',
    is_profile_complete = true
  WHERE id = u14;

  -- Arun Prakash - Mechanical Engineer
  UPDATE profiles SET
    approval_status = 'approved', approved_by = admin_id, approved_at = NOW() - INTERVAL '39 days',
    city = 'Chennai', state = 'Tamil Nadu',
    profession = 'Senior Engineer', company = 'Tata Motors', industry = 'Manufacturing',
    skills = ARRAY['Mechanical Engineering', 'Automotive Design', 'CAD/CAM', 'Manufacturing', 'Six Sigma'],
    linkedin_url = 'https://linkedin.com/in/arunprakash-eng',
    bio = 'Senior Engineer at Tata Motors EV division working on next-gen electric vehicle platforms. 12 years in automotive industry. IIT Madras alumnus. Hold 3 patents in battery thermal management.',
    whatsapp_number = '9876543225',
    is_profile_complete = true
  WHERE id = u15;


  -- ============================================================
  -- 3. LOOK UP PRE-SEEDED CATEGORY IDs
  -- ============================================================

  SELECT id INTO fc_jobs       FROM forum_categories WHERE slug = 'jobs-careers';
  SELECT id INTO fc_business   FROM forum_categories WHERE slug = 'business';
  SELECT id INTO fc_realestate FROM forum_categories WHERE slug = 'real-estate';
  SELECT id INTO fc_agriculture FROM forum_categories WHERE slug = 'agriculture';
  SELECT id INTO fc_technology FROM forum_categories WHERE slug = 'technology';
  SELECT id INTO fc_memories   FROM forum_categories WHERE slug = 'school-memories';
  SELECT id INTO fc_general    FROM forum_categories WHERE slug = 'general';

  SELECT id INTO mc_electronics FROM marketplace_categories WHERE slug = 'electronics';
  SELECT id INTO mc_vehicles    FROM marketplace_categories WHERE slug = 'vehicles';
  SELECT id INTO mc_realestate  FROM marketplace_categories WHERE slug = 'real-estate';
  SELECT id INTO mc_agriculture FROM marketplace_categories WHERE slug = 'agriculture';
  SELECT id INTO mc_services    FROM marketplace_categories WHERE slug = 'services';

  SELECT id INTO msc_phones      FROM marketplace_subcategories WHERE slug = 'phones';
  SELECT id INTO msc_laptops     FROM marketplace_subcategories WHERE slug = 'laptops';
  SELECT id INTO msc_cars        FROM marketplace_subcategories WHERE slug = 'cars';
  SELECT id INTO msc_bikes       FROM marketplace_subcategories WHERE slug = 'bikes';
  SELECT id INTO msc_flats       FROM marketplace_subcategories WHERE slug = 'flats';
  SELECT id INTO msc_plots       FROM marketplace_subcategories WHERE slug = 'plots';
  SELECT id INTO msc_produce     FROM marketplace_subcategories WHERE slug = 'produce';
  SELECT id INTO msc_equipment   FROM marketplace_subcategories WHERE slug = 'equipment';
  SELECT id INTO msc_consultants FROM marketplace_subcategories WHERE slug = 'consultants';
  SELECT id INTO msc_other_electronics FROM marketplace_subcategories WHERE slug = 'other-electronics';
  SELECT id INTO msc_tablets FROM marketplace_subcategories WHERE slug = 'tablets';
  SELECT id INTO msc_other_vehicles FROM marketplace_subcategories WHERE slug = 'other-vehicles';


  -- ============================================================
  -- 4. JOBS
  -- ============================================================

  INSERT INTO jobs (id, posted_by, title, company, description, location_city, location_state, job_type, experience_min, experience_max, salary_min, salary_max, skills_required, referral_available, contact_email, status, created_at) VALUES

  (job1, u1, 'Senior React Developer', 'Google India', E'We are looking for a Senior React Developer to join our Search team in Bangalore.\n\nResponsibilities:\n- Build and maintain large-scale web applications using React and TypeScript\n- Collaborate with UX designers and backend engineers\n- Mentor junior developers and conduct code reviews\n- Contribute to open-source projects\n\nRequirements:\n- 5+ years of experience with React/TypeScript\n- Strong understanding of web performance optimization\n- Experience with state management (Redux, Zustand)\n- Familiarity with CI/CD pipelines',
   'Bangalore', 'Karnataka', 'full_time', 5, 10, 2500000, 4500000, ARRAY['React', 'TypeScript', 'Node.js', 'System Design'], true, 'priya.patel@example.com', 'open', NOW() - INTERVAL '15 days'),

  (job2, u2, 'Sub-Inspector Recruitment 2026', 'Uttar Pradesh Police', E'UP Police is recruiting Sub-Inspectors through direct recruitment. JNV alumni are encouraged to apply.\n\nEligibility:\n- Graduate from recognized university\n- Age: 21-28 years (relaxation as per rules)\n- Physical fitness standards as per UP Police norms\n\nSelection Process:\n- Written examination\n- Physical efficiency test\n- Interview\n- Medical examination\n\nThis is a great opportunity for those who want to serve the nation in law enforcement.',
   'Lucknow', 'Uttar Pradesh', 'full_time', 0, 3, 44900, 142400, ARRAY['Law Enforcement', 'Physical Fitness', 'Hindi', 'English'], false, 'amit.singh@example.com', 'open', NOW() - INTERVAL '10 days'),

  (job3, u3, 'Junior Resident - Cardiology', 'AIIMS New Delhi', E'AIIMS New Delhi invites applications for Junior Resident positions in the Department of Cardiology.\n\nRequirements:\n- MBBS from recognized medical college\n- Valid medical registration\n- Interest in cardiology research\n\nBenefits:\n- Stipend as per AIIMS norms\n- Hostel accommodation\n- Academic mentorship from senior faculty\n- Opportunity to publish research papers',
   'New Delhi', 'Delhi', 'full_time', 0, 2, 56100, 56100, ARRAY['MBBS', 'Cardiology', 'Research', 'Patient Care'], false, 'sneha.verma@example.com', 'open', NOW() - INTERVAL '8 days'),

  (job4, u4, 'Product Manager - AgriTech', 'AgriTech Solutions Pvt Ltd', E'Join our growing team to build the future of Indian agriculture!\n\nRole:\n- Define product roadmap for our farmer marketplace app\n- Work closely with engineering and design teams\n- Conduct user research with farmers across India\n- Analyze market trends and competitor strategies\n\nIdeal Candidate:\n- 3-5 years PM experience\n- Understanding of Indian agriculture ecosystem\n- Data-driven decision making\n- Hindi/regional language proficiency is a plus',
   'Mumbai', 'Maharashtra', 'full_time', 3, 5, 1800000, 2800000, ARRAY['Product Management', 'Agile', 'Data Analysis', 'Agriculture'], true, 'vikram.joshi@example.com', 'open', NOW() - INTERVAL '12 days'),

  (job5, u5, 'Data Analyst - Azure AI', 'Microsoft India', E'Microsoft India is hiring Data Analysts for the Azure AI team.\n\nWhat you will do:\n- Analyze large datasets to derive business insights\n- Build dashboards and reports using Power BI\n- Collaborate with data scientists on ML projects\n- Present findings to stakeholders\n\nRequirements:\n- 2-4 years of experience in data analysis\n- Proficiency in SQL, Python, and visualization tools\n- Strong communication skills\n- B.Tech/M.Tech in CS/Statistics preferred',
   'Hyderabad', 'Telangana', 'full_time', 2, 4, 1200000, 2200000, ARRAY['SQL', 'Python', 'Power BI', 'Statistics', 'Data Analysis'], true, 'ananya.reddy@example.com', 'open', NOW() - INTERVAL '5 days'),

  (job6, u6, 'Tax Consultant', 'Deloitte India', E'Deloitte India Tax Practice is looking for experienced Tax Consultants.\n\nResponsibilities:\n- Advise clients on domestic and international tax matters\n- Prepare and review tax returns for corporate clients\n- Research tax law changes and their implications\n- Support senior partners in client engagements\n\nRequirements:\n- CA/CMA qualified\n- 2-5 years post-qualification experience\n- Knowledge of Indian tax laws, GST, transfer pricing\n- Excellent analytical and communication skills',
   'Mumbai', 'Maharashtra', 'full_time', 2, 5, 1000000, 1800000, ARRAY['Taxation', 'GST', 'Financial Analysis', 'Audit'], true, 'rahul.mehta@example.com', 'open', NOW() - INTERVAL '18 days'),

  (job7, u10, 'Backend Developer - AWS', 'Amazon India', E'Amazon India is hiring Backend Developers for the AWS Lambda team in Gurgaon.\n\nAbout the role:\n- Design and build scalable microservices\n- Work with distributed systems at massive scale\n- Optimize performance and reduce latency\n- Participate in on-call rotations\n\nBasic Qualifications:\n- 3+ years of backend development experience\n- Proficiency in Java, Python, or Go\n- Experience with cloud services (AWS preferred)\n- Strong CS fundamentals',
   'Gurgaon', 'Haryana', 'full_time', 3, 8, 2000000, 3800000, ARRAY['Java', 'AWS', 'Microservices', 'Docker', 'Distributed Systems'], true, 'arjun.gupta@example.com', 'open', NOW() - INTERVAL '7 days'),

  (job8, u9, 'Research Associate - AI Lab', 'IIT Kanpur', E'The AI Lab at IIT Kanpur is seeking Research Associates for a DRDO-funded project.\n\nProject: Natural Language Understanding for Indian Languages\n\nRequirements:\n- M.Tech/MS in CS or related field\n- Experience with NLP, deep learning\n- Publications in top venues preferred\n- Proficiency in Python, PyTorch/TensorFlow\n\nDuration: 2 years (extendable)\nFellowship: As per DRDO norms + HRA',
   'Kanpur', 'Uttar Pradesh', 'contract', 0, 3, 600000, 900000, ARRAY['NLP', 'Deep Learning', 'Python', 'PyTorch', 'Research'], false, 'kavita.mishra@example.com', 'open', NOW() - INTERVAL '20 days'),

  (job9, u12, 'Probationary Officer', 'State Bank of India', E'SBI is recruiting Probationary Officers through nationwide examination.\n\nEligibility:\n- Graduate in any discipline from recognized university\n- Age: 21-30 years\n\nSelection Process:\n- Preliminary Examination\n- Main Examination\n- Group Discussion & Interview\n\nPosting: Pan-India\n\nJNV alumni have consistently excelled in banking exams. This is a stable career with excellent growth prospects.',
   NULL, NULL, 'full_time', 0, 0, 44900, 142400, ARRAY['Banking', 'Aptitude', 'English', 'Reasoning'], false, 'manish.tiwari@example.com', 'open', NOW() - INTERVAL '3 days'),

  (job10, u13, 'UX Design Intern', 'Flipkart', E'Flipkart Design team is looking for passionate UX Design interns.\n\nWhat you will learn:\n- End-to-end product design process\n- User research methodologies\n- Design systems at scale\n- Accessibility and inclusive design\n\nRequirements:\n- Pursuing/completed degree in Design/HCI\n- Portfolio showcasing design projects\n- Proficiency in Figma\n- Passion for solving user problems\n\nStipend: Rs 50,000/month | Duration: 6 months',
   'Bangalore', 'Karnataka', 'internship', 0, 0, 50000, 50000, ARRAY['UX Design', 'Figma', 'User Research', 'Prototyping'], false, 'neha.agarwal@example.com', 'open', NOW() - INTERVAL '2 days');


  -- ============================================================
  -- 5. JOB APPLICATIONS
  -- ============================================================

  INSERT INTO job_applications (job_id, applicant_id, cover_note, status, created_at) VALUES
  (job1,  u10, 'I have 6 years of React experience at Amazon and would love to join Google. My TypeScript and system design skills align well with this role.', 'under_review', NOW() - INTERVAL '14 days'),
  (job1,  u5,  'Transitioning from data science to full-stack development. Strong Python and JS skills.', 'applied', NOW() - INTERVAL '13 days'),
  (job5,  u1,  'Interested in this data analyst role. I have strong SQL and Python skills from my engineering background.', 'applied', NOW() - INTERVAL '4 days'),
  (job4,  u8,  'As an agriculture consultant, I bring deep domain knowledge that would be valuable for AgriTech Solutions.', 'interview', NOW() - INTERVAL '10 days'),
  (job7,  u1,  'Currently at Google but interested in the AWS Lambda team. Have extensive experience with Node.js and cloud services.', 'under_review', NOW() - INTERVAL '6 days'),
  (job10, u5,  'As a data scientist with design thinking experience, I am very interested in this UX internship to broaden my skills.', 'applied', NOW() - INTERVAL '1 day'),
  (job6,  u12, 'Banking professional with strong financial analysis skills. Looking to transition into consulting.', 'applied', NOW() - INTERVAL '16 days');


  -- ============================================================
  -- 6. EVENTS
  -- ============================================================

  INSERT INTO events (id, organizer_id, title, description, event_date, end_date, venue, location_city, location_state, is_online, meeting_url, max_attendees, status, created_at) VALUES

  (evt1, admin_id, 'Annual JNV Alumni National Meet 2026',
   E'Join us for the grand annual alumni meet! This year we celebrate 30 years of JNV alumni excellence.\n\nAgenda:\n- Keynote by Chief Guest (to be announced)\n- State-wise alumni networking sessions\n- Panel discussion: "JNV Alumni in Nation Building"\n- Cultural evening and dinner\n- Recognition of outstanding alumni achievers\n\nRegistration is free. Travel and accommodation to be arranged by attendees.',
   NOW() + INTERVAL '45 days', NOW() + INTERVAL '47 days', 'India Habitat Centre', 'New Delhi', 'Delhi', false, NULL, 500, 'upcoming', NOW() - INTERVAL '30 days'),

  (evt2, u1, 'Tech Networking Evening - Bangalore',
   E'An informal evening for JNV alumni working in tech across Bangalore.\n\nFormat:\n- Lightning talks (5 min each) - share what you are working on\n- Speed networking sessions\n- Pizza and drinks\n\nWhether you are at a startup, MNC, or freelancing - come connect with fellow Navodayans in tech!',
   NOW() + INTERVAL '20 days', NOW() + INTERVAL '20 days', 'WeWork Galaxy, Residency Road', 'Bangalore', 'Karnataka', false, NULL, 80, 'upcoming', NOW() - INTERVAL '15 days'),

  (evt3, u9, 'Career Guidance Webinar: UPSC & Civil Services',
   E'A comprehensive webinar on cracking UPSC Civil Services exam.\n\nSpeakers:\n- Dr. Rajesh Kumar (IAS 2002) - Strategy & mindset\n- Amit Singh (IPS 2008) - Optional subject selection\n- Pooja Srivastava (IFS 2010) - Interview preparation\n\nTarget Audience: JNV students and recent graduates aspiring for civil services.\n\nFree registration. Recording will be shared with all registered participants.',
   NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days', NULL, NULL, NULL, true, 'https://meet.google.com/abc-defg-hij', 200, 'upcoming', NOW() - INTERVAL '12 days'),

  (evt4, admin_id, 'Bihar JNV Alumni Reunion 2026',
   E'Calling all JNV alumni from Bihar!\n\nA nostalgic reunion to reconnect with batchmates and seniors from all JNV schools in Bihar.\n\nHighlights:\n- School-wise photo sessions\n- Sharing memories and achievements\n- Discussion on supporting current JNV students in Bihar\n- Lunch and cultural program\n\n100+ alumni attended last year. Let us make it even bigger!',
   NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days', 'Hotel Maurya, Patna', 'Patna', 'Bihar', false, NULL, 200, 'completed', NOW() - INTERVAL '60 days'),

  (evt5, u4, 'Entrepreneurship Workshop: From Idea to Startup',
   E'A hands-on workshop for aspiring entrepreneurs from the JNV community.\n\nTopics:\n- Validating your business idea\n- Building an MVP\n- Fundraising basics - angels, VCs, grants\n- Legal structure and compliance\n- Growth hacking on a budget\n\nLed by Vikram Joshi (Founder, AgriTech Solutions) and guest speakers from the startup ecosystem.',
   NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', 'IIT Bombay Campus', 'Mumbai', 'Maharashtra', false, NULL, 60, 'completed', NOW() - INTERVAL '45 days'),

  (evt6, u8, 'Agriculture Innovation Summit 2026',
   E'Annual summit bringing together JNV alumni working in agriculture and allied sectors.\n\nThemes:\n- Organic farming best practices\n- Technology in agriculture (drones, IoT, AI)\n- Government schemes and subsidies\n- Market linkage and supply chain\n- Success stories from JNV agripreneurs\n\nOpen to all JNV alumni interested in agriculture, irrespective of current profession.',
   NOW() + INTERVAL '60 days', NOW() + INTERVAL '61 days', 'Birla Auditorium', 'Jaipur', 'Rajasthan', false, NULL, 150, 'upcoming', NOW() - INTERVAL '20 days'),

  (evt7, u7, 'Legal Rights Awareness Camp',
   E'Free legal awareness camp organized by JNV alumni lawyers.\n\nTopics Covered:\n- Property rights and land disputes\n- Consumer rights\n- Cyber crime awareness\n- Women safety laws\n- RTI and PIL basics\n\nFree legal consultation available after the session. Bring your documents if you need specific advice.',
   NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days', 'Town Hall, Ernakulam', 'Kochi', 'Kerala', false, NULL, 100, 'completed', NOW() - INTERVAL '70 days'),

  (evt8, u10, 'Hackathon for Social Good 2026',
   E'48-hour online hackathon for JNV alumni developers and designers.\n\nTheme: Technology for Rural India\n\nTracks:\n- Education technology\n- Healthcare access\n- Agriculture solutions\n- Financial inclusion\n\nPrizes:\n- 1st: Rs 1,00,000 + Mentorship from Sequoia\n- 2nd: Rs 50,000\n- 3rd: Rs 25,000\n\nTeam size: 2-4 members. At least one JNV alumni per team.',
   NOW() + INTERVAL '35 days', NOW() + INTERVAL '37 days', NULL, NULL, NULL, true, 'https://hackathon.jnvalumni.org', 100, 'upcoming', NOW() - INTERVAL '10 days');


  -- ============================================================
  -- 7. EVENT REGISTRATIONS
  -- ============================================================

  INSERT INTO event_registrations (event_id, user_id, status, created_at) VALUES
  -- Annual Meet (popular)
  (evt1, u1,  'registered', NOW() - INTERVAL '28 days'),
  (evt1, u2,  'registered', NOW() - INTERVAL '27 days'),
  (evt1, u3,  'registered', NOW() - INTERVAL '26 days'),
  (evt1, u4,  'registered', NOW() - INTERVAL '25 days'),
  (evt1, u5,  'registered', NOW() - INTERVAL '25 days'),
  (evt1, u6,  'registered', NOW() - INTERVAL '24 days'),
  (evt1, u9,  'registered', NOW() - INTERVAL '22 days'),
  (evt1, u11, 'registered', NOW() - INTERVAL '20 days'),
  (evt1, u15, 'registered', NOW() - INTERVAL '18 days'),
  -- Tech Networking
  (evt2, u5,  'registered', NOW() - INTERVAL '14 days'),
  (evt2, u10, 'registered', NOW() - INTERVAL '13 days'),
  (evt2, u13, 'registered', NOW() - INTERVAL '12 days'),
  -- Career Guidance Webinar
  (evt3, u1,  'registered', NOW() - INTERVAL '11 days'),
  (evt3, u5,  'registered', NOW() - INTERVAL '10 days'),
  (evt3, u10, 'registered', NOW() - INTERVAL '10 days'),
  (evt3, u12, 'registered', NOW() - INTERVAL '9 days'),
  (evt3, u15, 'registered', NOW() - INTERVAL '8 days'),
  -- Bihar Reunion (completed)
  (evt4, admin_id, 'registered', NOW() - INTERVAL '55 days'),
  (evt4, u2,  'registered', NOW() - INTERVAL '50 days'),
  -- Entrepreneurship Workshop (completed)
  (evt5, u8,  'registered', NOW() - INTERVAL '40 days'),
  (evt5, u14, 'registered', NOW() - INTERVAL '38 days'),
  (evt5, u6,  'registered', NOW() - INTERVAL '35 days'),
  -- Agriculture Summit
  (evt6, u8,  'registered', NOW() - INTERVAL '18 days'),
  (evt6, u14, 'registered', NOW() - INTERVAL '17 days'),
  (evt6, u4,  'registered', NOW() - INTERVAL '15 days'),
  -- Hackathon
  (evt8, u1,  'registered', NOW() - INTERVAL '9 days'),
  (evt8, u10, 'registered', NOW() - INTERVAL '8 days'),
  (evt8, u5,  'registered', NOW() - INTERVAL '7 days'),
  (evt8, u13, 'registered', NOW() - INTERVAL '6 days');


  -- ============================================================
  -- 8. ANNOUNCEMENTS
  -- ============================================================

  INSERT INTO announcements (id, author_id, title, content, type, is_pinned, created_at) VALUES

  (ann1, admin_id, 'Welcome to the JNV Alumni Network Platform!',
   E'Dear Navodayans,\n\nI am thrilled to announce the launch of our official JNV Alumni Network platform! This has been a dream project for many of us who wanted a dedicated space where JNV alumni from across India can connect, collaborate, and support each other.\n\nFeatures available:\n- Alumni Directory with search and filters\n- Job Board for sharing opportunities\n- Events calendar for meetups and reunions\n- Discussion Forum for knowledge sharing\n- Marketplace for alumni businesses\n- Mentorship program\n\nPlease complete your profile, invite fellow Navodayans, and make this platform vibrant!\n\nJai Hind!\nDr. Rajesh Kumar\nPlatform Administrator',
   'general', true, NOW() - INTERVAL '180 days'),

  (ann2, admin_id, 'Congratulations! Priya Patel Promoted to Senior Staff Engineer at Google',
   E'We are proud to announce that our fellow Navodayan Priya Patel (JNV Ahmedabad, Batch 2011) has been promoted to Senior Staff Engineer at Google India!\n\nPriya has been instrumental in building Google Search infrastructure serving billions of users. She is also an active mentor on our platform.\n\nThis is a testament to the talent that JNV schools nurture. Congratulations, Priya!\n\n#NaodayanPride #JNVAlumni',
   'achievement', false, NOW() - INTERVAL '45 days'),

  (ann3, admin_id, 'JNV Alumni Scholarship Fund - Applications Open',
   E'The JNV Alumni Scholarship Fund is now accepting applications for the academic year 2026-27.\n\nScholarship Details:\n- Amount: Up to Rs 50,000 per year\n- Eligibility: Current JNV students or recent graduates pursuing higher education\n- Selection: Based on merit and financial need\n\nHow to Apply:\n- Fill the online form (link in comments)\n- Submit academic transcripts\n- Write a 500-word essay on your goals\n\nDeadline: July 31, 2026\n\nFunded entirely by alumni contributions. If you would like to contribute, please reach out.',
   'opportunity', true, NOW() - INTERVAL '20 days'),

  (ann4, u4, 'AgriTech Solutions Raises Series A - Hiring JNV Alumni!',
   E'Excited to share that AgriTech Solutions has raised Rs 25 Crore in Series A funding from Sequoia Capital India!\n\nWe are on a mission to transform Indian agriculture through technology, and we are hiring across all departments:\n- Engineering (React, Node.js, Python)\n- Product Management\n- Operations (field team across states)\n- Marketing\n\nJNV alumni get priority consideration. Check the Jobs section for open positions or DM me directly.\n\nLet us build something amazing together!',
   'opportunity', false, NOW() - INTERVAL '30 days'),

  (ann5, u3, 'Free Cardiac Health Camp - Delhi NCR',
   E'AIIMS Cardiology Department is organizing a free cardiac health screening camp for JNV alumni and their families in Delhi NCR.\n\nDate: Next Sunday, 10 AM - 4 PM\nVenue: AIIMS OPD Block\n\nServices:\n- ECG\n- Blood pressure screening\n- Cholesterol test\n- Consultation with cardiologists\n\nNo prior appointment needed. Bring your Aadhaar card.\n\nPrevention is better than cure. Take care of your heart!',
   'general', false, NOW() - INTERVAL '8 days'),

  (ann6, u2, 'JNV Varanasi Batch of 2004 - 20 Year Reunion',
   E'Attention all alumni from JNV Varanasi, Batch of 2004!\n\nWe are organizing a grand 20-year reunion. It has been two decades since we left the campus, and it is time to relive those memories.\n\nProposed Date: August 15, 2026 (Independence Day weekend)\nVenue: JNV Varanasi campus (permission obtained from Principal)\n\nPlease confirm your attendance by replying here or WhatsApp me at 9876543212.\n\nSpread the word to batchmates who may not be on this platform yet!',
   'update', false, NOW() - INTERVAL '12 days'),

  (ann7, u9, 'IIT Kanpur Summer Research Internship for JNV Students',
   E'IIT Kanpur CSE Department is offering 10 summer research internships exclusively for JNV students currently in Class 11 or 12.\n\nDuration: 6 weeks (June-July 2026)\nStipend: Rs 15,000/month + free hostel\n\nAreas:\n- Artificial Intelligence\n- Cyber Security\n- Robotics\n- Web Development\n\nApplication: Send resume and statement of interest to kavita.mishra@example.com\nDeadline: June 15, 2026\n\nLet us give back to the community that shaped us!',
   'opportunity', false, NOW() - INTERVAL '5 days'),

  (ann8, u14, 'Organic Farm Visit - Open Invitation for Alumni',
   E'I invite all JNV alumni visiting Nagpur to tour our 50-acre organic farm and dairy.\n\nWhat you will see:\n- Organic vegetable cultivation\n- Vermicomposting unit\n- Dairy operations (50 cows, A2 milk)\n- Direct-to-consumer packing facility\n\nThis could be especially useful for alumni thinking about returning to farming or starting agri-businesses.\n\nNo formal booking needed - just WhatsApp me a day before. Lunch on the farm is on us!\n\nContact: 9876543224',
   'general', false, NOW() - INTERVAL '3 days');


  -- ============================================================
  -- 9. FORUM POSTS
  -- ============================================================

  INSERT INTO forum_posts (id, category_id, author_id, title, content, view_count, likes_count, comments_count, created_at) VALUES

  (fp1, fc_jobs, u1, 'Tips for Cracking Google Interview - My Experience',
   E'I recently went through the Google interview process and wanted to share my experience for fellow Navodayans.\n\nPreparation (3 months):\n1. LeetCode - solved 300+ problems (focus on medium difficulty)\n2. System Design - read "Designing Data-Intensive Applications" cover to cover\n3. Behavioral - prepared STAR format stories from my career\n\nInterview Rounds:\n- Round 1: Coding (array/string manipulation)\n- Round 2: Coding (graph problem - BFS)\n- Round 3: System Design (design YouTube recommendation system)\n- Round 4: Behavioral + Leadership\n- Round 5: Googleyness\n\nKey Tips:\n- Think aloud during coding rounds\n- Ask clarifying questions before jumping to solution\n- System design is about trade-offs, not the "right" answer\n- Be genuine in behavioral rounds\n\nFeel free to ask questions. Happy to help fellow JNVians!',
   234, 18, 5, NOW() - INTERVAL '60 days'),

  (fp2, fc_technology, u10, 'Best Tech Stack for Building a Startup in 2026',
   E'Starting a side project and want to discuss the current best tech stack choices.\n\nWhat I am considering:\n- Frontend: Next.js 16 + TypeScript + Tailwind CSS\n- Backend: Supabase (PostgreSQL + Auth + Storage)\n- Hosting: Vercel\n- Mobile: React Native / Expo\n\nQuestions for the community:\n1. Is Supabase production-ready for a startup with 10K+ users?\n2. Next.js vs Remix - which one should I pick?\n3. Any recommendations for payment gateway integration in India?\n4. Should I go serverless or traditional server?\n\nWould love to hear from alumni who have built production applications.',
   187, 12, 4, NOW() - INTERVAL '45 days'),

  (fp3, fc_agriculture, u8, 'Transitioning from IT to Organic Farming - My Journey',
   E'I spent 10 years in IT before returning to my roots in Rajasthan to become a full-time farmer. Here is my experience.\n\nWhy I left IT:\n- Corporate burnout after a decade\n- Family farmland was lying unused\n- Growing demand for organic produce\n- Wanted to do something meaningful\n\nChallenges I faced:\n- Initial 2 years were tough financially\n- Learning curve for organic certification\n- Marketing organic produce at premium prices\n- Weather dependency and crop risks\n\nWhat worked:\n- Direct-to-consumer model via WhatsApp groups\n- Diversifying crops (not just wheat/rice)\n- Value addition (jams, pickles, dried herbs)\n- Government subsidies for organic farming\n\nCurrent status: Earning more than my IT salary, much happier!\n\nAsk me anything about this transition.',
   312, 25, 3, NOW() - INTERVAL '55 days'),

  (fp4, fc_memories, u2, 'Remember the Midnight Maggi Sessions at JNV?',
   E'Who else remembers those legendary midnight Maggi sessions in the hostel?\n\nThe routine was always the same:\n- Wait for the warden to complete night rounds\n- Someone would sneak the electric heater from the common room\n- Pool money for Maggi packets from the canteen\n- Extra masala was the secret ingredient\n- Fear of getting caught added to the taste\n\nI still remember the time our entire batch got caught by Principal sir at 2 AM. Instead of punishing us, he asked for a plate himself! Best night ever.\n\nJNV memories are the best memories. Share your favorite hostel stories here!',
   456, 35, 5, NOW() - INTERVAL '90 days'),

  (fp5, fc_business, u4, 'How I Raised Series A for My AgriTech Startup',
   E'After 2 years of bootstrapping, AgriTech Solutions finally raised Series A from Sequoia. Here is the journey:\n\nBootstrapping phase:\n- Started with Rs 10 lakh personal savings\n- Built MVP in 3 months with a 2-person team\n- Got 500 farmers on the platform in first year\n- Revenue: Rs 12 lakh in Year 1\n\nFundraising journey:\n- Pitched to 30+ VCs, got rejected by 25\n- Key learning: VCs want traction, not just ideas\n- Our growth metrics (10x revenue growth) opened doors\n- Sequoia invested Rs 25 Cr at Rs 100 Cr valuation\n\nAdvice for aspiring founders:\n1. Solve a real problem you deeply understand\n2. Focus on unit economics from Day 1\n3. Build a strong founding team\n4. JNV network is incredibly helpful - use it!\n\nHappy to chat with anyone exploring entrepreneurship.',
   278, 22, 3, NOW() - INTERVAL '35 days'),

  (fp6, fc_realestate, u6, 'Tax Benefits on Home Loan - Complete Guide for 2026',
   E'As a CA, I frequently get questions about home loan tax benefits. Here is a comprehensive guide:\n\nSection 24(b) - Interest on Home Loan:\n- Deduction up to Rs 2,00,000 per year on interest paid\n- Property must be self-occupied\n- For let-out property, no upper limit on interest deduction\n\nSection 80C - Principal Repayment:\n- Deduction up to Rs 1,50,000 (shared with other 80C investments)\n- Includes stamp duty and registration charges in the year of purchase\n\nSection 80EEA - Additional Interest Deduction:\n- Extra Rs 1,50,000 for affordable housing (stamp value up to Rs 45 lakh)\n- Available for loans sanctioned between April 2019 - March 2022\n\nJoint Home Loan Benefits:\n- Both co-borrowers can claim deductions separately\n- Effectively doubles the tax benefit\n\nPro tip: Always get a home loan even if you can pay cash - the tax benefits make it worthwhile.\n\nDM me for specific queries.',
   189, 14, 2, NOW() - INTERVAL '28 days'),

  (fp7, fc_general, admin_id, 'Platform Feature Requests - What Do You Want to See?',
   E'Dear alumni,\n\nThe platform is evolving and I want to hear from you. What features would make this more useful?\n\nSome ideas we are considering:\n1. Alumni chapter-wise groups (state/city)\n2. Job referral system with tracking\n3. Alumni business discount program\n4. Batch-wise photo albums\n5. Mentorship matching algorithm\n6. Mobile app (iOS + Android)\n7. WhatsApp integration for notifications\n\nPlease vote by replying with the feature numbers you want most, or suggest new ideas.\n\nLet us build this together!',
   523, 30, 5, NOW() - INTERVAL '75 days'),

  (fp8, fc_jobs, u5, 'Data Science Career Path in India - 2026 Perspective',
   E'Data Science has matured significantly in India. Here is my take on the current landscape:\n\nRoles and Salaries (approximate):\n- Data Analyst: Rs 6-12 LPA\n- Data Scientist: Rs 12-25 LPA\n- Senior DS: Rs 25-45 LPA\n- ML Engineer: Rs 15-35 LPA\n- AI Research: Rs 20-50 LPA\n\nMust-have skills:\n1. Python (pandas, scikit-learn, PyTorch)\n2. SQL (this is non-negotiable)\n3. Statistics and probability\n4. ML fundamentals\n5. Communication and storytelling\n\nNice-to-have:\n- Cloud platforms (AWS/Azure/GCP)\n- MLOps (Docker, Kubernetes, MLflow)\n- Domain knowledge (fintech, healthcare, etc.)\n\nBest resources:\n- Andrew Ng Coursera courses\n- Kaggle competitions\n- Fast.ai (free, practical)\n\nThe field is competitive but opportunities are growing. Happy to mentor juniors.',
   198, 16, 2, NOW() - INTERVAL '25 days'),

  (fp9, fc_memories, u7, 'JNV Teachers Who Changed Our Lives',
   E'Let us dedicate this thread to those amazing JNV teachers who shaped who we are today.\n\nI will start:\n\nSuresh Sir (Mathematics, JNV Ernakulam):\n- Made calculus feel like a game\n- Would stay after school hours to help weak students\n- His catchphrase: "Mathematics is not about numbers, it is about logic"\n- Single-handedly responsible for 15 students clearing IIT from our batch\n\nMeera Ma''am (English, JNV Ernakulam):\n- Introduced us to Shakespeare and made us love literature\n- Started the school magazine where I first published my writing\n- Her debate coaching helped me become a lawyer\n\nPlease share about teachers who made a difference in your life. Let us appreciate them!',
   345, 28, 4, NOW() - INTERVAL '50 days'),

  (fp10, fc_business, u14, 'Starting a Dairy Farm - Practical Guide',
   E'After 5 years of running my dairy farm in Nagpur, here is a practical guide for anyone interested:\n\nInitial Investment:\n- Land: Rs 20-30 lakh (if buying)\n- 10 cows (Gir/Sahiwal): Rs 5-8 lakh\n- Shed construction: Rs 3-5 lakh\n- Equipment (milking machine, cooler): Rs 2-3 lakh\n- Working capital (6 months): Rs 3-5 lakh\n- Total: Rs 33-51 lakh\n\nRevenue Model:\n- A2 milk: Rs 80-100/litre (premium pricing)\n- Ghee: Rs 2000-2500/kg\n- Paneer, curd: Additional revenue\n- Cow dung: Vermicompost (Rs 10/kg)\n\nBreak-even: 18-24 months\nROI after stabilization: 25-35%\n\nCritical Success Factors:\n1. Quality of cattle (breed matters)\n2. Proper feed management\n3. Veterinary support\n4. Marketing channels\n5. Hygiene and quality control\n\nVisit my farm anytime for firsthand experience!',
   167, 11, 2, NOW() - INTERVAL '18 days'),

  (fp11, fc_technology, u1, 'Next.js 16 - What is New and Should You Upgrade?',
   E'Next.js 16 was released with some major changes. Here is my analysis after migrating a production app:\n\nKey Changes:\n1. searchParams and params are now Promises (breaking change!)\n2. Turbopack is now the default bundler\n3. Improved streaming and partial rendering\n4. Better error boundaries\n5. React 19 integration\n\nMigration Pain Points:\n- Every page with dynamic params needs async/await updates\n- Some third-party libraries not yet compatible\n- Turbopack has different caching behavior\n\nPerformance Improvements:\n- Build times: 40% faster with Turbopack\n- Cold start: 30% improvement\n- Bundle size: ~15% reduction\n\nShould you upgrade?\n- New projects: Definitely yes\n- Existing projects: Wait for stable 16.x if you have many dynamic routes\n\nHappy to help anyone facing migration issues.',
   145, 9, 2, NOW() - INTERVAL '22 days'),

  (fp12, fc_general, u11, 'JNV Alumni in Foreign Services - AMA',
   E'I am an IFS officer currently posted at MEA headquarters in Delhi. Previously served in Paris and Washington D.C.\n\nOpening this thread for an Ask Me Anything about:\n- Indian Foreign Service preparation\n- Life as a diplomat\n- UPSC exam strategy\n- Working abroad as a government officer\n- International relations career paths\n\nSome FAQs I get:\n- Yes, IFS is the most competitive UPSC service after IAS\n- Language skills are a huge plus (I speak French and Spanish)\n- Posting abroad is exciting but comes with challenges\n- The work is deeply fulfilling if you care about India''s global role\n\nAsk away! I will try to respond to everyone.',
   267, 19, 3, NOW() - INTERVAL '40 days');


  -- ============================================================
  -- 10. FORUM COMMENTS
  -- ============================================================

  INSERT INTO forum_comments (id, post_id, author_id, content, likes_count, created_at) VALUES
  -- Comments on "Google Interview Tips"
  (fc1, fp1, u10, 'Great tips, Priya! I can vouch for the system design book recommendation. Also want to add - mock interviews with peers are incredibly helpful. I did 20+ mocks before my Amazon interviews.', 8, NOW() - INTERVAL '59 days'),
  (fc2, fp1, u5,  'How long did the entire process take from application to offer? And did you use any specific platform for system design practice?', 3, NOW() - INTERVAL '58 days'),
  (fc3, fp1, u1,  'The entire process took about 6 weeks. For system design, I used ByteByteGo and also watched Gaurav Sen YouTube videos. Both are excellent.', 5, NOW() - INTERVAL '57 days'),
  (fc4, fp1, u9,  'As someone who conducts interviews at IIT, I can confirm - thinking aloud is the single most important thing. We want to understand your thought process, not just the final answer.', 12, NOW() - INTERVAL '56 days'),
  (fc5, fp1, u13, 'Would these tips apply for design roles too? I am preparing for Google UX interviews.', 2, NOW() - INTERVAL '55 days'),

  -- Comments on "Best Tech Stack"
  (fc6, fp2, u1,  'I use exactly this stack (Next.js + Supabase + Vercel) at my side project and it is fantastic for rapid development. Supabase is definitely production-ready - we handle 50K+ users.', 7, NOW() - INTERVAL '44 days'),
  (fc7, fp2, u5,  'For payment gateway, Razorpay is the best option in India. Their API is clean and documentation is excellent. We use it at our team for internal billing.', 4, NOW() - INTERVAL '43 days'),
  (fc8, fp2, u15, 'One suggestion - consider adding Redis for caching if you expect high traffic. Upstash provides serverless Redis that works great with Vercel.', 3, NOW() - INTERVAL '42 days'),
  (fc9, fp2, u13, 'From a design perspective, Tailwind + shadcn/ui is the best combo right now. Highly customizable and accessible out of the box.', 5, NOW() - INTERVAL '41 days'),

  -- Comments on "IT to Farming"
  (fc10, fp3, u14, 'This resonates so much, Suresh bhai! I made a similar transition. The first 2 years are definitely the hardest. But once you figure out the marketing, it gets much better. Direct-to-consumer is the key.', 9, NOW() - INTERVAL '54 days'),
  (fc11, fp3, u4,  'Love this story! This is exactly why we built AgriTech Solutions - to help farmers like you reach consumers directly through technology. Would love to onboard your farm on our platform.', 6, NOW() - INTERVAL '53 days'),
  (fc12, fp3, u8,  'Thanks Vikram! Let us connect. I have been looking for a tech platform for better market access. Will DM you.', 3, NOW() - INTERVAL '52 days'),

  -- Comments on "Midnight Maggi"
  (fc13, fp4, u7,  'Hahaha this is so relatable! At JNV Ernakulam, we used to make Maggi in the bathroom because the warden would check rooms. The tiles still have masala stains probably!', 15, NOW() - INTERVAL '89 days'),
  (fc14, fp4, u1,  'At JNV Ahmedabad, our warden was so strict that we switched to bread and jam as our midnight snack. Less risky but less fun too!', 10, NOW() - INTERVAL '88 days'),
  (fc15, fp4, u9,  'The best part was the "lookout" system - one person standing at the door while others cooked. Pure teamwork. Skills that actually helped in corporate life!', 18, NOW() - INTERVAL '87 days'),
  (fc16, fp4, admin_id, 'At JNV Nalanda, our Principal caught us but instead of scolding, he told us stories about his own hostel days. That man was a legend. RIP Sharma sir.', 22, NOW() - INTERVAL '86 days'),
  (fc17, fp4, u14, 'Do kids these days even know the struggle of hiding an electric heater inside a bucket? That was engineering before engineering college!', 14, NOW() - INTERVAL '85 days'),

  -- Comments on "Platform Feature Requests"
  (fc18, fp7, u1,  'Strong vote for #6 (Mobile app) and #7 (WhatsApp integration). Most alumni I know check WhatsApp 10x more than any other app.', 8, NOW() - INTERVAL '74 days'),
  (fc19, fp7, u4,  'I would add: Alumni investment network. Many of us are looking to invest in startups by fellow Navodayans. A dedicated section for this would be amazing.', 11, NOW() - INTERVAL '73 days'),
  (fc20, fp7, u13, 'Can we have a design showcase section? Many alumni are doing creative work but there is no place to display it. Like a portfolio gallery.', 6, NOW() - INTERVAL '72 days'),

  -- Nested reply
  (gen_random_uuid(), fp7, admin_id, 'All great suggestions! I am noting them down. Mobile app is highest priority. WhatsApp integration is technically complex but we will explore it. Keep the ideas coming!', 9, NOW() - INTERVAL '71 days'),
  (gen_random_uuid(), fp7, u10, 'I can help build the mobile app using React Native. Would be happy to contribute to this project as open source. Let us set up a GitHub repo!', 7, NOW() - INTERVAL '70 days'),

  -- Comments on other posts
  (gen_random_uuid(), fp5, u6, 'Congratulations on the Series A, Vikram! From a finance perspective, your unit economics sound solid. The 10x revenue growth is impressive for an agritech startup.', 4, NOW() - INTERVAL '34 days'),
  (gen_random_uuid(), fp5, u12, 'This is inspiring. I have been thinking about leaving banking to start something. Your journey gives me hope. Can we connect over a call?', 3, NOW() - INTERVAL '33 days'),
  (gen_random_uuid(), fp5, u8, 'As a farmer who uses tech platforms, I can confirm that AgriTech Solutions is one of the better ones. The farmer-friendly interface makes a big difference.', 5, NOW() - INTERVAL '32 days'),

  (gen_random_uuid(), fp6, u12, 'Great guide, Rahul! One addition - for NRIs, the tax implications are different. Section 24(b) limit does not apply for let-out property. Worth mentioning for our alumni abroad.', 3, NOW() - INTERVAL '27 days'),
  (gen_random_uuid(), fp6, u4, 'Saved this for reference. Was just looking into buying a flat in Mumbai. The joint loan tip is gold!', 2, NOW() - INTERVAL '26 days'),

  (gen_random_uuid(), fp8, u10, 'I would add MLOps as a must-have now, not nice-to-have. Every DS job posting I see requires Docker and basic CI/CD knowledge.', 4, NOW() - INTERVAL '24 days'),
  (gen_random_uuid(), fp8, u9, 'From an academic perspective, I would recommend also learning causal inference and experiment design. These skills differentiate good data scientists from great ones.', 6, NOW() - INTERVAL '23 days'),

  (gen_random_uuid(), fp9, u2, 'Our PT teacher at JNV Varanasi - Yadav sir. He trained 3 national-level athletes from our school. Woke us up at 5 AM every day, rain or shine. We hated it then, grateful now.', 11, NOW() - INTERVAL '49 days'),
  (gen_random_uuid(), fp9, admin_id, 'Mathematics teacher at JNV Nalanda - Pandey sir. He would solve JEE Advanced problems on the blackboard just for fun. Half our batch cracked IIT because of him.', 14, NOW() - INTERVAL '48 days'),
  (gen_random_uuid(), fp9, u14, 'Hindi teacher Sharma ma''am at JNV Nagpur. She made us fall in love with poetry. I still recite Mahadevi Verma poems that she taught us.', 8, NOW() - INTERVAL '47 days'),
  (gen_random_uuid(), fp9, u15, 'Science lab assistant Raman sir at JNV Chennai. He would stay till 9 PM helping us with practical experiments. Unsung hero.', 6, NOW() - INTERVAL '46 days'),

  (gen_random_uuid(), fp10, u8, 'Great breakdown, Sanjay! I would add that cattle insurance is absolutely essential. One sick cow can wipe out months of profit. NABARD has good schemes for this.', 4, NOW() - INTERVAL '17 days'),
  (gen_random_uuid(), fp10, u4, 'We are building a dairy management module in our app. Would love to feature your farm as a case study. Let us discuss!', 2, NOW() - INTERVAL '16 days'),

  (gen_random_uuid(), fp11, u10, 'The params being Promises caught me off guard too. Had to refactor 40+ pages. But the performance improvement is worth it.', 3, NOW() - INTERVAL '21 days'),
  (gen_random_uuid(), fp11, u5, 'Turbopack build times are insane. Our project went from 3 minutes to under 1 minute. Huge DX improvement.', 4, NOW() - INTERVAL '20 days'),

  (gen_random_uuid(), fp12, u2, 'Pooja, how different is IFS preparation from IAS? I cleared IPS with the same UPSC exam. Do IFS officers have a separate training program?', 5, NOW() - INTERVAL '39 days'),
  (gen_random_uuid(), fp12, u9, 'As a professor, I often guide students for UPSC. The key differentiator for IFS is the personality test - they look for diplomatic temperament. Your language skills are a huge advantage.', 7, NOW() - INTERVAL '38 days'),
  (gen_random_uuid(), fp12, u15, 'What is the work-life balance like in IFS compared to corporate jobs? And how often do you get to choose your posting country?', 3, NOW() - INTERVAL '37 days');


  -- ============================================================
  -- 11. FORUM LIKES
  -- ============================================================

  INSERT INTO forum_likes (user_id, post_id, created_at) VALUES
  -- Likes on various posts
  (u1,  fp4, NOW() - INTERVAL '89 days'),
  (u2,  fp4, NOW() - INTERVAL '88 days'),
  (u3,  fp4, NOW() - INTERVAL '87 days'),
  (u5,  fp4, NOW() - INTERVAL '86 days'),
  (u7,  fp4, NOW() - INTERVAL '85 days'),
  (u9,  fp1, NOW() - INTERVAL '59 days'),
  (u10, fp1, NOW() - INTERVAL '58 days'),
  (u13, fp1, NOW() - INTERVAL '57 days'),
  (u4,  fp3, NOW() - INTERVAL '54 days'),
  (u14, fp3, NOW() - INTERVAL '53 days'),
  (u1,  fp7, NOW() - INTERVAL '74 days'),
  (u4,  fp7, NOW() - INTERVAL '73 days'),
  (u5,  fp7, NOW() - INTERVAL '72 days'),
  (u10, fp7, NOW() - INTERVAL '71 days'),
  (u13, fp7, NOW() - INTERVAL '70 days'),
  (u6,  fp5, NOW() - INTERVAL '34 days'),
  (u8,  fp5, NOW() - INTERVAL '33 days'),
  (u12, fp5, NOW() - INTERVAL '32 days'),
  (u2,  fp9, NOW() - INTERVAL '49 days'),
  (u14, fp9, NOW() - INTERVAL '48 days'),
  (u15, fp9, NOW() - INTERVAL '47 days'),
  (u1,  fp2, NOW() - INTERVAL '44 days'),
  (u5,  fp2, NOW() - INTERVAL '43 days'),
  (u3,  fp8, NOW() - INTERVAL '24 days'),
  (u10, fp8, NOW() - INTERVAL '23 days'),
  (u2,  fp12, NOW() - INTERVAL '39 days'),
  (u9,  fp12, NOW() - INTERVAL '38 days');


  -- ============================================================
  -- 12. BUSINESSES
  -- ============================================================

  INSERT INTO businesses (id, owner_id, name, description, category, services, location_city, location_state, website, phone, email, is_verified, created_at) VALUES

  (biz1, u4, 'AgriTech Solutions Pvt Ltd',
   'India''s leading farm-to-fork technology platform connecting 50,000+ farmers directly with consumers and retailers. Our app helps farmers get fair prices, reduce wastage, and access modern agricultural practices. Series A funded by Sequoia Capital.',
   'Technology',
   ARRAY['Farm Marketplace', 'Crop Advisory', 'Supply Chain', 'AgriFinance', 'Weather Alerts'],
   'Mumbai', 'Maharashtra', 'https://agritechsolutions.in', '9876543214', 'hello@agritechsolutions.in', true, NOW() - INTERVAL '140 days'),

  (biz2, u8, 'Yadav Organic Farms',
   'Premium organic produce delivered fresh from our farms in Rajasthan. We grow 40+ varieties of vegetables, fruits, and herbs without any chemical pesticides or fertilizers. NPOP and USDA Organic certified.',
   'Agriculture',
   ARRAY['Organic Vegetables', 'Organic Fruits', 'Herbs & Spices', 'Farm Tours', 'Organic Certification Consulting'],
   'Jaipur', 'Rajasthan', NULL, '9876543218', 'suresh@yadavorganicfarms.in', true, NOW() - INTERVAL '100 days'),

  (biz3, u7, 'Nair & Associates - Advocates',
   'Full-service law firm specializing in corporate law, intellectual property, and civil litigation. 15+ years of practice at Kerala High Court. Known for ethical practice and affordable legal services.',
   'Legal',
   ARRAY['Corporate Law', 'IP Law', 'Civil Litigation', 'Legal Consultation', 'Contract Drafting', 'Property Law'],
   'Kochi', 'Kerala', NULL, '9876543217', 'office@nairassociates.in', true, NOW() - INTERVAL '110 days'),

  (biz4, u1, 'CodeCraft Academy',
   'Online coding school founded by Google engineers for Indian students. We teach practical, industry-relevant programming through live classes and real-world projects. Special scholarships for JNV students.',
   'Education',
   ARRAY['Web Development Bootcamp', 'Data Science Course', 'DSA Masterclass', 'System Design Workshop', 'Mock Interviews'],
   'Bangalore', 'Karnataka', 'https://codecraft.academy', '9876543211', 'learn@codecraft.academy', false, NOW() - INTERVAL '80 days'),

  (biz5, u14, 'Dubey Organic Farms & Dairy',
   'Family-run 50-acre organic farm and dairy in Vidarbha region. We produce A2 milk, ghee, paneer, and seasonal organic vegetables. Direct-to-consumer delivery in Nagpur city. Farm visits welcome!',
   'Agriculture',
   ARRAY['A2 Milk', 'Organic Ghee', 'Fresh Paneer', 'Seasonal Vegetables', 'Farm Experience Tours', 'Vermicompost'],
   'Nagpur', 'Maharashtra', NULL, '9876543224', 'sanjay@dubeyorganicfarms.in', true, NOW() - INTERVAL '45 days'),

  (biz6, u3, 'HeartCare Diagnostics',
   'Advanced cardiac diagnostic center founded by AIIMS-trained cardiologists. We offer affordable cardiac screening packages including ECG, Echo, TMT, and Holter monitoring. Free camps conducted quarterly.',
   'Healthcare',
   ARRAY['ECG', 'Echocardiography', 'TMT', 'Holter Monitoring', 'Cardiac Risk Assessment', 'Preventive Health Checkup'],
   'New Delhi', 'Delhi', NULL, '9876543213', 'info@heartcarediagnostics.in', false, NOW() - INTERVAL '70 days'),

  (biz7, u6, 'Mehta Financial Advisory',
   'Comprehensive financial planning and tax advisory services for individuals and businesses. Specializing in tax optimization, investment planning, and corporate compliance. Trusted by 500+ clients across India.',
   'Finance',
   ARRAY['Tax Planning', 'GST Filing', 'Investment Advisory', 'Corporate Compliance', 'NRI Taxation', 'Startup Financial Planning'],
   'Mumbai', 'Maharashtra', NULL, '9876543216', 'ca.rahulmehta@gmail.com', true, NOW() - INTERVAL '90 days'),

  (biz8, u13, 'DesignLab Studio',
   'Boutique UX/UI design studio creating delightful digital experiences. We work with startups and enterprises to build user-centered products. Our team has designed for 10M+ users across e-commerce, fintech, and healthcare.',
   'Technology',
   ARRAY['UX Design', 'UI Development', 'Design Systems', 'User Research', 'Accessibility Audit', 'Design Sprint Facilitation'],
   'Bangalore', 'Karnataka', 'https://designlabstudio.in', '9876543223', 'hello@designlabstudio.in', false, NOW() - INTERVAL '50 days');


  -- ============================================================
  -- 13. MARKETPLACE LISTINGS
  -- ============================================================

  INSERT INTO marketplace_listings (id, seller_id, category_id, subcategory_id, title, description, price, price_negotiable, condition, location_city, location_state, images, status, seller_name, seller_avatar_url, view_count, created_at) VALUES

  (ml1, u10, mc_electronics, msc_laptops, 'MacBook Pro 14" M3 Pro - Like New',
   'Selling my MacBook Pro 14" M3 Pro (2024 model). Bought 8 months ago, barely used as I got a company laptop. Comes with original charger, box, and AppleCare+ valid till 2027. 18GB RAM, 512GB SSD. Battery cycle count: 45. No scratches or dents.',
   125000, true, 'like_new', 'Gurgaon', 'Haryana',
   ARRAY['https://placehold.co/800x600/1a1a2e/ffffff.png?text=MacBook+Pro+14+M3+Pro', 'https://placehold.co/800x600/2d2d3f/ffffff.png?text=MacBook+Pro+-+Top+View'],
   'active', 'Arjun Gupta', NULL, 87, NOW() - INTERVAL '14 days'),

  (ml2, u15, mc_vehicles, msc_cars, 'Tata Nexon EV Max LR - 2024 Model',
   'Selling my Tata Nexon EV Max Long Range. Empowered Plus variant. Pristine White color. Only 12,000 km driven. Full service history from Tata authorized center. Extended warranty till 2029. Reason: Company providing a car now. All documents clear, insurance valid till March 2027.',
   1350000, true, 'like_new', 'Chennai', 'Tamil Nadu',
   ARRAY['https://placehold.co/800x600/e8e8e8/333333.png?text=Tata+Nexon+EV+Max+LR', 'https://placehold.co/800x600/d4d4d4/333333.png?text=Nexon+EV+-+Interior', 'https://placehold.co/800x600/c0c0c0/333333.png?text=Nexon+EV+-+Dashboard'],
   'active', 'Arun Prakash', NULL, 156, NOW() - INTERVAL '12 days'),

  (ml3, u6, mc_realestate, msc_flats, '2BHK Flat in Andheri West - Ready to Move',
   'Selling my 2BHK flat in a premium society in Andheri West, Mumbai. 950 sqft carpet area. West facing with sea breeze. 8th floor, 2 covered parking. Society has swimming pool, gym, clubhouse. Well maintained. 10 min walk from Andheri metro station. Clear title, no legal disputes.',
   18500000, true, 'good', 'Mumbai', 'Maharashtra',
   ARRAY['https://placehold.co/800x600/c49a6c/ffffff.png?text=2BHK+-+Living+Room', 'https://placehold.co/800x600/b8896e/ffffff.png?text=2BHK+-+Kitchen', 'https://placehold.co/800x600/a07850/ffffff.png?text=2BHK+-+Bedroom', 'https://placehold.co/800x600/c4a882/ffffff.png?text=Society+Amenities'],
   'active', 'Rahul Mehta', NULL, 234, NOW() - INTERVAL '20 days'),

  (ml4, u8, mc_agriculture, msc_produce, 'Premium Organic Rajasthani Honey - Bulk',
   'Pure organic honey harvested from our apiary in Aravalli hills. FSSAI certified. Available in bulk (5kg, 10kg, 25kg packs). Multiflora variety with rich taste and aroma. Lab tested, no added sugar. Perfect for retailers, health food stores, or personal consumption. Minimum order: 5kg.',
   450, false, 'new', 'Jaipur', 'Rajasthan',
   ARRAY['https://placehold.co/800x600/daa520/000000.png?text=Organic+Rajasthani+Honey', 'https://placehold.co/800x600/c4941a/000000.png?text=Honey+-+5kg+Pack'],
   'active', 'Suresh Yadav', NULL, 78, NOW() - INTERVAL '8 days'),

  (ml5, u14, mc_agriculture, msc_produce, 'A2 Gir Cow Ghee - Farm Fresh',
   'Traditional bilona method A2 ghee from our Gir cows. Made from curd, not cream. Rich golden color and amazing aroma. Each batch is small and handcrafted. Available in 500ml, 1L, and 5L packs. We deliver across Maharashtra. Also available: A2 milk subscription in Nagpur.',
   1200, false, 'new', 'Nagpur', 'Maharashtra',
   ARRAY['https://placehold.co/800x600/f5c842/000000.png?text=A2+Gir+Cow+Ghee', 'https://placehold.co/800x600/e6b833/000000.png?text=Bilona+Method+Ghee'],
   'active', 'Sanjay Dubey', NULL, 112, NOW() - INTERVAL '6 days'),

  (ml6, u1, mc_electronics, msc_phones, 'iPhone 15 Pro Max 256GB - Natural Titanium',
   'iPhone 15 Pro Max in excellent condition. 256GB, Natural Titanium. Used for 10 months with case and screen protector (no scratches). Battery health 96%. Comes with original box, cable, and unused EarPods. Selling because upgrading to iPhone 16. Can show bill from Apple Store.',
   95000, true, 'like_new', 'Bangalore', 'Karnataka',
   ARRAY['https://placehold.co/800x600/2c2c2e/ffffff.png?text=iPhone+15+Pro+Max', 'https://placehold.co/800x600/3a3a3c/ffffff.png?text=iPhone+15+Pro+-+Back', 'https://placehold.co/800x600/48484a/ffffff.png?text=iPhone+15+Pro+-+Box'],
   'active', 'Priya Patel', NULL, 145, NOW() - INTERVAL '10 days'),

  (ml7, u3, mc_services, msc_consultants, 'Online Cardiac Health Consultation',
   'Offering online cardiac health consultations for JNV alumni and their families at discounted rates. I am a DM Cardiology from AIIMS with 10+ years of experience. Consultation includes: medical history review, report interpretation, treatment advice, and follow-up. Book via WhatsApp.',
   500, false, 'new', 'New Delhi', 'Delhi',
   ARRAY['https://placehold.co/800x600/dc2626/ffffff.png?text=Cardiac+Health+Consultation'],
   'active', 'Dr. Sneha Verma', NULL, 67, NOW() - INTERVAL '15 days'),

  (ml8, u7, mc_services, msc_consultants, 'Legal Consultation - Property & Corporate',
   'Offering discounted legal consultation services for JNV alumni. 15+ years experience at Kerala High Court. Areas: property disputes, corporate law, IP protection, contract review, and civil litigation. First consultation free for fellow Navodayans. Available both in-person (Kochi) and online.',
   1000, false, 'new', 'Kochi', 'Kerala',
   ARRAY['https://placehold.co/800x600/1e3a5f/ffffff.png?text=Legal+Consultation+Service'],
   'active', 'Deepika Nair', NULL, 45, NOW() - INTERVAL '18 days'),

  (ml9, u15, mc_vehicles, msc_bikes, 'Royal Enfield Classic 350 - Signals Edition',
   'Royal Enfield Classic 350 Signals edition (Stormrider Sand). 2023 model, 8000 km driven. All services done at RE authorized center. Extras: crash guard, saddle bag, touring seat. Great condition, no scratches. Selling due to transfer to another city. RC transfer included.',
   165000, true, 'good', 'Chennai', 'Tamil Nadu',
   ARRAY['https://placehold.co/800x600/4a4a4a/ffffff.png?text=Royal+Enfield+Classic+350', 'https://placehold.co/800x600/5a5a5a/ffffff.png?text=RE+Classic+-+Side+View'],
   'active', 'Arun Prakash', NULL, 98, NOW() - INTERVAL '5 days'),

  (ml10, u8, mc_agriculture, msc_equipment, 'Drip Irrigation System - Complete Kit',
   'Complete drip irrigation kit suitable for 1 acre. Used for one season, in excellent condition. Includes: main pipeline, laterals, drippers, filters, fertigation unit, and timer controller. Brand: Jain Irrigation. Original cost Rs 85,000. Upgrading to larger system, hence selling.',
   45000, true, 'good', 'Jaipur', 'Rajasthan',
   ARRAY['https://placehold.co/800x600/22c55e/ffffff.png?text=Drip+Irrigation+Kit', 'https://placehold.co/800x600/16a34a/ffffff.png?text=Irrigation+Components'],
   'active', 'Suresh Yadav', NULL, 34, NOW() - INTERVAL '4 days'),

  -- ==================== BUDGET-FRIENDLY LISTINGS ====================

  (ml11, u13, mc_electronics, msc_phones, 'Samsung Galaxy M34 5G - 128GB Midnight Blue',
   'Samsung Galaxy M34 5G in great condition. 128GB storage, 6GB RAM. Used for 6 months with tempered glass and back cover (no scratches). Battery health excellent - 6000mAh lasts full day easily. Selling because switching to iPhone. Comes with original charger and box. Bill available.',
   8999, true, 'good', 'Bangalore', 'Karnataka',
   ARRAY['https://placehold.co/800x600/1428a0/ffffff.png?text=Samsung+Galaxy+M34+5G', 'https://placehold.co/800x600/0d1f78/ffffff.png?text=Galaxy+M34+-+Back+View'],
   'active', 'Neha Agarwal', NULL, 54, NOW() - INTERVAL '3 days'),

  (ml12, u10, mc_electronics, msc_other_electronics, 'JBL Flip 5 Bluetooth Speaker - Teal',
   'JBL Flip 5 portable waterproof speaker. Received as gift, used maybe 10 times. IPX7 waterproof rating. 12-hour battery life. Incredible bass for its size. Perfect for trips and outdoor gatherings. Original box and USB-C cable included. MRP was Rs 11,999.',
   3500, true, 'like_new', 'Gurgaon', 'Haryana',
   ARRAY['https://placehold.co/800x600/008080/ffffff.png?text=JBL+Flip+5+Speaker'],
   'active', 'Arjun Gupta', NULL, 42, NOW() - INTERVAL '2 days'),

  (ml13, u8, mc_agriculture, msc_produce, 'Organic Turmeric & Spice Gift Pack',
   'Farm-fresh organic spice collection from Yadav Organic Farms. Pack includes: Turmeric powder (250g), Red chilli powder (250g), Coriander powder (250g), Cumin seeds (100g), and Mustard seeds (100g). All grown without pesticides on our certified organic farm. FSSAI certified. Makes a great gift!',
   399, false, 'new', 'Jaipur', 'Rajasthan',
   ARRAY['https://placehold.co/800x600/c0392b/ffffff.png?text=Organic+Spice+Gift+Pack', 'https://placehold.co/800x600/a93226/ffffff.png?text=Turmeric+Chilli+Coriander'],
   'active', 'Suresh Yadav', NULL, 89, NOW() - INTERVAL '1 day'),

  (ml14, u12, mc_vehicles, msc_bikes, 'Hero Splendor Plus BS6 - 2022',
   'Hero Splendor Plus BS6, 2022 model. Black with silver graphics. Only 15,000 km driven, always serviced at Hero authorized center. New battery replaced 2 months ago. Tyres have 60% life remaining. PUC valid. Insurance till December 2026. Best commuter bike - gives 70+ kmpl mileage.',
   32000, true, 'good', 'Bhopal', 'Madhya Pradesh',
   ARRAY['https://placehold.co/800x600/333333/ffffff.png?text=Hero+Splendor+Plus+BS6', 'https://placehold.co/800x600/444444/ffffff.png?text=Splendor+-+Side+View'],
   'active', 'Manish Tiwari', NULL, 67, NOW() - INTERVAL '6 days'),

  (ml15, u6, mc_services, msc_consultants, 'ITR Filing & Tax Planning Service - Rs 999 Only',
   'Professional Income Tax Return filing by a practicing Chartered Accountant (Deloitte experience). Special discounted rate for JNV alumni. Service includes: ITR preparation, filing, tax-saving suggestions, and post-filing support. Salaried, freelancers, and business owners welcome. Quick 24-hour turnaround.',
   999, false, 'new', 'Mumbai', 'Maharashtra',
   ARRAY['https://placehold.co/800x600/2563eb/ffffff.png?text=ITR+Filing+Service'],
   'active', 'Rahul Mehta', NULL, 123, NOW() - INTERVAL '9 days'),

  (ml16, u14, mc_agriculture, msc_produce, 'Farm Fresh Mango Pickle - Homemade 1kg',
   'Authentic homemade raw mango pickle (aam ka achaar) made by my mother using traditional Vidarbha recipe. Mustard oil, fenugreek, fennel, and hand-ground spices. No preservatives, no artificial colors. Sun-dried for 15 days for perfect taste. Each jar is 1kg. Shelf life: 1 year. Shipping across India.',
   280, false, 'new', 'Nagpur', 'Maharashtra',
   ARRAY['https://placehold.co/800x600/e67e22/ffffff.png?text=Homemade+Mango+Pickle', 'https://placehold.co/800x600/d35400/ffffff.png?text=Traditional+Aam+Achaar'],
   'active', 'Sanjay Dubey', NULL, 76, NOW() - INTERVAL '2 days');


  -- ============================================================
  -- 14. WISHLISTS
  -- ============================================================

  INSERT INTO wishlists (user_id, listing_id, created_at) VALUES
  (u1,  ml1,  NOW() - INTERVAL '13 days'),
  (u5,  ml1,  NOW() - INTERVAL '12 days'),
  (u13, ml2,  NOW() - INTERVAL '11 days'),
  (u4,  ml3,  NOW() - INTERVAL '19 days'),
  (u12, ml3,  NOW() - INTERVAL '18 days'),
  (u1,  ml6,  NOW() - INTERVAL '9 days'),
  (u10, ml6,  NOW() - INTERVAL '8 days'),
  (u4,  ml4,  NOW() - INTERVAL '7 days'),
  (u14, ml10, NOW() - INTERVAL '3 days'),
  (u2,  ml7,  NOW() - INTERVAL '14 days'),
  (u9,  ml8,  NOW() - INTERVAL '17 days'),
  -- Budget listings wishlists
  (u1,  ml13, NOW() - INTERVAL '1 day'),
  (u3,  ml13, NOW() - INTERVAL '1 day'),
  (u5,  ml16, NOW() - INTERVAL '2 days'),
  (u2,  ml15, NOW() - INTERVAL '8 days'),
  (u11, ml15, NOW() - INTERVAL '7 days'),
  (u4,  ml12, NOW() - INTERVAL '2 days'),
  (u15, ml11, NOW() - INTERVAL '3 days');


  -- ============================================================
  -- 15. MEDIA
  -- ============================================================

  INSERT INTO media (id, uploaded_by, title, description, file_url, file_type, category, batch_year, tags, created_at) VALUES

  (med1, admin_id, 'JNV Nalanda Campus - Aerial View 2024',
   'Beautiful aerial drone shot of JNV Nalanda campus showing the main building, sports ground, and hostel blocks. The campus has grown so much since the 1990s!',
   'https://placehold.co/1200x800/2563eb/ffffff.png?text=JNV+Nalanda+Campus', 'image/jpeg', 'School Life', 1996,
   ARRAY['JNV Nalanda', 'Campus', 'Bihar', 'Aerial View'], NOW() - INTERVAL '120 days'),

  (med2, u2, 'JNV Varanasi Batch of 2004 - Group Photo',
   'Our batch group photo taken on the last day of school. 60 students who spent 6 beautiful years together. Some have gone on to become IAS, doctors, engineers, and entrepreneurs. Proud of every single one!',
   'https://placehold.co/1200x800/16a34a/ffffff.png?text=Batch+2004+Group+Photo', 'image/jpeg', 'School Life', 2004,
   ARRAY['JNV Varanasi', 'Batch 2004', 'Group Photo', 'Farewell'], NOW() - INTERVAL '100 days'),

  (med3, admin_id, 'Bihar Alumni Reunion 2026 - Highlights',
   'Highlights from the Bihar JNV Alumni Reunion held at Hotel Maurya, Patna. Over 100 alumni from 15 different JNV schools in Bihar came together for a day of nostalgia, networking, and celebrations.',
   'https://placehold.co/1200x800/dc2626/ffffff.png?text=Bihar+Reunion+2026', 'image/jpeg', 'Reunions', NULL,
   ARRAY['Bihar', 'Reunion', 'Alumni Meet', 'Patna'], NOW() - INTERVAL '24 days'),

  (med4, u4, 'AgriTech Solutions - Team at Office',
   'Our growing team at AgriTech Solutions Mumbai office. From 2 co-founders to 120+ employees in 3 years. Many team members are JNV alumni. Proud to build something meaningful together!',
   'https://placehold.co/1200x800/f59e0b/ffffff.png?text=AgriTech+Team', 'image/jpeg', 'Achievements', NULL,
   ARRAY['AgriTech Solutions', 'Startup', 'Team', 'Mumbai'], NOW() - INTERVAL '30 days'),

  (med5, u1, 'Tech Meetup Bangalore - JNV Alumni in Tech',
   'Photo from our monthly tech meetup in Bangalore. 25 JNV alumni working at Google, Amazon, Microsoft, Flipkart, and various startups came together for knowledge sharing and networking.',
   'https://placehold.co/1200x800/8b5cf6/ffffff.png?text=Tech+Meetup+BLR', 'image/jpeg', 'Events', NULL,
   ARRAY['Bangalore', 'Tech', 'Meetup', 'Networking'], NOW() - INTERVAL '40 days'),

  (med6, u8, 'Organic Farm Harvest - Jaipur',
   'Fresh harvest day at Yadav Organic Farms! This season we grew tomatoes, brinjal, okra, ridge gourd, and mint. All organic, all delicious. Direct from our farm to your table.',
   'https://placehold.co/1200x800/22c55e/ffffff.png?text=Farm+Harvest', 'image/jpeg', 'Other', NULL,
   ARRAY['Organic Farming', 'Harvest', 'Jaipur', 'Agriculture'], NOW() - INTERVAL '15 days'),

  (med7, u9, 'IIT Kanpur - AI Lab Research Presentation',
   'Our AI Lab team presenting research on Natural Language Understanding for Indian Languages at an international conference. Proud that JNV alumni are contributing to cutting-edge AI research.',
   'https://placehold.co/1200x800/0891b2/ffffff.png?text=AI+Lab+Presentation', 'image/jpeg', 'Achievements', NULL,
   ARRAY['IIT Kanpur', 'AI Research', 'NLP', 'Conference'], NOW() - INTERVAL '35 days'),

  (med8, u7, 'Legal Aid Camp - Kochi',
   'Free legal aid camp organized by Nair & Associates for underprivileged communities in Kochi. Over 200 people received free legal consultation on property rights, consumer disputes, and family law matters.',
   'https://placehold.co/1200x800/e11d48/ffffff.png?text=Legal+Aid+Camp', 'image/jpeg', 'Events', NULL,
   ARRAY['Legal Aid', 'Kochi', 'Community Service', 'Pro Bono'], NOW() - INTERVAL '38 days');


  -- ============================================================
  -- 16. MENTORSHIP REQUESTS
  -- ============================================================

  INSERT INTO mentorship_requests (mentor_id, mentee_id, area, message, status, created_at) VALUES

  (u1, u10, 'Software Engineering',
   'Hi Priya, I am a developer at Amazon and aspire to join Google someday. Would love your guidance on preparing for Google interviews and growing as a senior engineer. Your forum post on Google interviews was very helpful!',
   'active', NOW() - INTERVAL '45 days'),

  (u9, u5, 'Career Guidance',
   'Prof. Kavita, I am a data scientist at Microsoft and considering pursuing a PhD in AI. Would appreciate your guidance on transitioning from industry to academia and choosing the right research area.',
   'accepted', NOW() - INTERVAL '30 days'),

  (u4, u12, 'Startups',
   'Hi Vikram, I have been in banking for 14 years and want to start my own fintech company. Your entrepreneurship journey is inspiring. Would you be willing to mentor me through the initial stages?',
   'active', NOW() - INTERVAL '20 days'),

  (u2, u15, 'UPSC',
   'Amit sir, I am an engineer at Tata Motors but want to prepare for UPSC. I know it is a big career change. Your journey to IPS is very motivating. Can you guide me on preparation strategy while working full-time?',
   'pending', NOW() - INTERVAL '10 days'),

  (u7, u11, 'Career Guidance',
   'Deepika ma''am, I am an IFS officer interested in understanding intellectual property law better for my diplomatic work. Your expertise in IP law would be invaluable. Can we schedule monthly calls?',
   'active', NOW() - INTERVAL '35 days'),

  (u8, u4, 'Agriculture',
   'Suresh bhai, I am building AgriTech Solutions and want to understand ground-level farming challenges better. Your 20 years of experience would help us build better products. Would you be open to being our agriculture advisor?',
   'completed', NOW() - INTERVAL '60 days');


  RAISE NOTICE 'Seed data inserted successfully!';
  RAISE NOTICE 'Admin login: admin@jnvalumni.org / Alumni@123';
  RAISE NOTICE 'Sample user: priya.patel@example.com / Alumni@123';

END $$;
