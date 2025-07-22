-- Add screening_config column to projects table
ALTER TABLE public.projects 
ADD COLUMN screening_config JSONB DEFAULT '{"approvalMethod": null, "questions": []}';

-- Add index for better performance when querying screening configs
CREATE INDEX idx_projects_screening_config ON public.projects USING GIN (screening_config);