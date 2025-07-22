-- Add last_active_tab column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN last_active_tab text DEFAULT 'personal';