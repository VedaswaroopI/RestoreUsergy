-- Add survey_config column to projects table
ALTER TABLE public.projects 
ADD COLUMN survey_config JSONB DEFAULT '{"questions": []}'::JSONB;