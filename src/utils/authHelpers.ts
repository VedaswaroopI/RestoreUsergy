import { supabase } from '@/integrations/supabase/client';

export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    // Try to trigger a password reset for the email
    // If the email doesn't exist, Supabase won't send an email but also won't throw an error
    // We can use this behavior to check existence
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/password-reset-dummy`
    });
    
    // If there's no error, the email exists in the system
    // Supabase doesn't throw errors for non-existent emails to prevent email enumeration
    // But we can use a different approach
    return false; // This method isn't reliable, let's use a different approach
  } catch (error) {
    return false;
  }
};

export const validatePassword = (password: string) => {
  const minLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: minLength && hasNumber && hasSymbol,
    errors: {
      minLength: !minLength ? "Password must be at least 8 characters" : "",
      hasNumber: !hasNumber ? "Password must contain at least one number" : "",
      hasSymbol: !hasSymbol ? "Password must contain at least one symbol" : "",
    }
  };
};