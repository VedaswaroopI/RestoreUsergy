-- Update user_profiles table to match new requirements

-- Remove fields that are no longer needed
ALTER TABLE public.user_profiles 
DROP COLUMN IF EXISTS health_wellness_info,
DROP COLUMN IF EXISTS finance_info,
DROP COLUMN IF EXISTS gaming_info,
DROP COLUMN IF EXISTS shopping_info;

-- Add new fields for Culture and lifestyle section
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS ethnicity text,
ADD COLUMN IF NOT EXISTS marital_status text,
ADD COLUMN IF NOT EXISTS children_count text,
ADD COLUMN IF NOT EXISTS political_affiliation text,
ADD COLUMN IF NOT EXISTS languages_spoken text[];

-- Add new fields for Product usage and ownership section
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS email_client text[],
ADD COLUMN IF NOT EXISTS cell_phone_network text,
ADD COLUMN IF NOT EXISTS social_media_hours text,
ADD COLUMN IF NOT EXISTS social_media_followers text,
ADD COLUMN IF NOT EXISTS streaming_subscriptions text[],
ADD COLUMN IF NOT EXISTS music_subscriptions text[],
ADD COLUMN IF NOT EXISTS owns_car text,
ADD COLUMN IF NOT EXISTS car_type text;

-- Create devices table for dynamic device management
CREATE TABLE IF NOT EXISTS public.user_devices (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
    device_type text NOT NULL,
    operating_system text NOT NULL,
    manufacturer text NOT NULL,
    model text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on devices table
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;

-- Create policies for devices table
CREATE POLICY "Users can view their own devices" 
ON public.user_devices 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own devices" 
ON public.user_devices 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devices" 
ON public.user_devices 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own devices" 
ON public.user_devices 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates on devices
CREATE TRIGGER update_user_devices_updated_at
BEFORE UPDATE ON public.user_devices
FOR EACH ROW
EXECUTE FUNCTION public.update_user_profiles_updated_at();