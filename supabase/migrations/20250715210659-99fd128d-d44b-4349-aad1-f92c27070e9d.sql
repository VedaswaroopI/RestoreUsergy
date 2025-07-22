-- Update user_profiles table for Education & Work tab changes
-- Remove employment_status column and add primary_work_role and primary_area_of_study columns

ALTER TABLE public.user_profiles 
DROP COLUMN IF EXISTS employment_status;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS primary_work_role text;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS primary_area_of_study text;