import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ClientHeader } from "@/components/ClientHeader";
import { Loader2, Sparkles, Users, Zap } from "lucide-react";
// Using uploaded illustration from public folder

export default function ClientSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must contain at least one uppercase letter and one number");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/client-email-verification`,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setError("An account with this email already exists");
        } else {
          setError(error.message);
        }
      } else {
        // Store email for verification page
        sessionStorage.setItem("client-verification-email", email);
        navigate("/client-email-verification");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientHeader />
      
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="space-y-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-card-foreground">
                  Join Usergy.ai
                </h1>
                <p className="mt-3 text-lg text-muted-foreground">
                  Start your journey with intelligent user research
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-card-foreground block mb-2">
                      Work Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-base border-input focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-sm font-medium text-card-foreground block mb-2">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 text-base border-input focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      required
                    />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Minimum 8 characters, with one uppercase letter and one number.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20 animate-fade-in">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Get Started"
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <a href="/client-login" className="font-medium text-primary hover:underline transition-colors">
                      Log In
                    </a>
                  </p>
                </div>
              </form>

              {/* Features list */}
              <div className="pt-6 border-t border-border">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Connect with real users</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                      <Zap className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">AI-powered insights</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">No credit card required</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Illustration */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden p-8">
          <div className="relative z-10 w-full max-w-2xl">
            <img
              src="/lovable-uploads/51cc6411-ea90-4f4f-b0fb-4deedbe4cb5c.png"
              alt="Join Usergy.ai"
              className="w-full h-auto object-contain animate-fade-in"
            />
          </div>
          
          {/* Floating elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-16 h-16 bg-primary/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-32 left-16 w-12 h-12 bg-primary/5 rounded-full animate-pulse animation-delay-1000"></div>
            <div className="absolute top-1/2 right-32 w-8 h-8 bg-primary/15 rounded-full animate-pulse animation-delay-2000"></div>
          </div>
        </div>
      </div>
    </div>
  );
}