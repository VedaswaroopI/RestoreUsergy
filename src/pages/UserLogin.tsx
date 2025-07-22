import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Incorrect email or password. Please try again.");
        } else if (error.message.includes("rate limit")) {
          setError("Too many requests. Please try again in a few minutes");
        } else {
          setError("An error occurred. Please try again");
        }
        return;
      }

      // Check if user has completed profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          // Check if profile is complete
          const isComplete = profile.first_name && 
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

          if (isComplete) {
            // Profile is complete, redirect to projects
            navigate("/user-projects");
          } else {
            // Profile incomplete, redirect to portal with last active tab
            navigate("/user-portal");
          }
        } else {
          // No profile, redirect to portal for profile completion
          navigate("/user-portal");
        }
      } else {
        navigate("/user-portal");
      }

      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in",
      });
    } catch (err) {
      setError("Network error. Please check your connection and try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError("Error sending reset email. Please try again");
        return;
      }

      toast({
        title: "Password reset email sent",
        description: "Please check your email for password reset instructions",
      });
    } catch (err) {
      setError("Network error. Please try again");
    }
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/41beb373-d01b-45b5-bfa1-9067e06619a2.png" alt="Usergy Logo" className="h-8 w-auto" />
            <span className="text-lg font-semibold text-foreground">Usergy</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-turquoise/20 via-sky-blue/20 to-coral/20 rounded-3xl blur-xl"></div>
              <div className="relative">
                <h1 className="text-4xl font-black text-foreground mb-2">
                  Welcome Back
                </h1>
                <div className="h-1 w-20 bg-gradient-to-r from-turquoise to-sky-blue mx-auto rounded-full"></div>
              </div>
            </div>
            <p className="text-xl font-semibold text-muted-foreground">
              Sign in to continue your AI journey.
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address <span className="text-coral">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary placeholder:opacity-60"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password <span className="text-coral">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary placeholder:opacity-60"
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive font-medium">{error}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={handlePasswordReset}
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
              >
                Forgot your password?
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                New to Usergy?{" "}
                <a
                  href="/user-signup"
                  className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                >
                  Sign up here
                </a>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                By signing in, you agree to our{" "}
                <a
                  href="https://usergy.ai/terms"
                  className="text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="https://usergy.ai/privacy"
                  className="text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Usergy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}