-- Add last_active_tab field to user_profiles table
ALTER TABLE public.user_profiles ADD COLUMN last_active_tab text DEFAULT 'basic';