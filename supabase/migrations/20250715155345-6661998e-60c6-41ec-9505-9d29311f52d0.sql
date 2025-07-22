-- Create user profiles table with comprehensive fields
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Account & Basic Info
  profile_pic_url TEXT,
  password_hash TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT,
  age TEXT NOT NULL,
  gender TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT,
  zip_code TEXT,
  timezone TEXT NOT NULL,
  
  -- Education & Lifestyle
  education_level TEXT NOT NULL,
  household_income TEXT,
  is_parent BOOLEAN NOT NULL,
  interest_categories TEXT[],
  
  -- Work Life & Tools
  employment_status TEXT NOT NULL,
  employment_industry TEXT,
  job_function TEXT,
  company_size TEXT,
  
  -- AI & Tech Fluency
  technical_experience TEXT NOT NULL,
  ai_interests TEXT[] NOT NULL,
  ai_familiarity TEXT NOT NULL,
  ai_models_used TEXT[] NOT NULL,
  programming_languages TEXT[] NOT NULL,
  specific_skills TEXT[],
  ai_tools_discovery TEXT,
  
  -- Portfolio & Socials
  has_projects BOOLEAN NOT NULL,
  portfolio_url TEXT,
  social_networks TEXT[] NOT NULL,
  help_amplify_products TEXT[],
  public_testimonials_ok BOOLEAN NOT NULL,
  discord_username TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  
  -- Culture and Lifestyle
  culture_interests TEXT[],
  
  -- Health and wellness
  health_wellness_info TEXT,
  
  -- Finance and investments
  finance_info TEXT,
  
  -- Video games and gaming preferences
  gaming_info TEXT,
  
  -- Shopping habits
  shopping_info TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one profile per user
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" 
ON public.user_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_profiles_updated_at();