import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/user-login');
        return;
      }

      // Check if user has completed profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // This hook can be used to determine redirect logic
      // but we'll let individual pages handle their own redirects
    };

    checkAuthAndProfile();
  }, [navigate]);
};

export const checkProfileCompletion = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { hasUser: false, hasProfile: false, isComplete: false };

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // Check if profile is complete (all required fields filled)
  const isComplete = profile && 
    profile.first_name && 
    profile.last_name && 
    profile.age && 
    profile.gender && 
    profile.country && 
    profile.timezone && 
    profile.education_level && 
    profile.technical_experience && 
    profile.ai_interests && 
    profile.ai_familiarity && 
    profile.ai_models_used && 
    profile.programming_languages && 
    profile.social_networks;

  return { 
    hasUser: true, 
    hasProfile: !!profile,
    isComplete: !!isComplete,
    profile,
    lastActiveTab: localStorage.getItem('lastActiveTab') || 'basic'
  };
};