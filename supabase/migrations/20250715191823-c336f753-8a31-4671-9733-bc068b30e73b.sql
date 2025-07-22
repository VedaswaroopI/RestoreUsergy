-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true);

-- Create storage policies for profile pictures
CREATE POLICY "Allow authenticated users to upload their profile pictures"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow authenticated users to view their own profile pictures"
ON storage.objects FOR SELECT
USING (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow authenticated users to update their profile pictures"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow authenticated users to delete their profile pictures"
ON storage.objects FOR DELETE
USING (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public access to profile pictures
CREATE POLICY "Public profile pictures are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'profiles');