-- Update user_profiles table structure for the new form layout
ALTER TABLE public.user_profiles 
-- Remove unused fields
DROP COLUMN IF EXISTS interest_categories,
DROP COLUMN IF EXISTS help_amplify_products,
DROP COLUMN IF EXISTS discord_username,
DROP COLUMN IF EXISTS culture_interests,
DROP COLUMN IF EXISTS ethnicity,
DROP COLUMN IF EXISTS marital_status,
DROP COLUMN IF EXISTS children_count,
DROP COLUMN IF EXISTS political_affiliation,
DROP COLUMN IF EXISTS email_client,
DROP COLUMN IF EXISTS cell_phone_network,
DROP COLUMN IF EXISTS social_media_hours,
DROP COLUMN IF EXISTS social_media_followers,
DROP COLUMN IF EXISTS streaming_subscriptions,
DROP COLUMN IF EXISTS music_subscriptions,
DROP COLUMN IF EXISTS owns_car,
DROP COLUMN IF EXISTS car_type;

-- Add new fields for the redesigned form
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS email_clients TEXT[],
ADD COLUMN IF NOT EXISTS cell_phone_network TEXT,
ADD COLUMN IF NOT EXISTS streaming_subscriptions TEXT[],
ADD COLUMN IF NOT EXISTS music_subscriptions TEXT[],
ADD COLUMN IF NOT EXISTS social_media_hours TEXT,
ADD COLUMN IF NOT EXISTS ai_tools_discovery TEXT;

-- Update existing fields to match new requirements
ALTER TABLE public.user_profiles 
ALTER COLUMN age TYPE INTEGER USING age::INTEGER,
ALTER COLUMN is_parent DROP NOT NULL,
ALTER COLUMN has_projects DROP NOT NULL,
ALTER COLUMN public_testimonials_ok DROP NOT NULL;

-- Add constraints for age
ALTER TABLE public.user_profiles 
ADD CONSTRAINT age_range CHECK (age >= 18 AND age <= 70);

-- Update ai_models_used to include Gemini instead of Bard
-- This will be handled in the frontend options