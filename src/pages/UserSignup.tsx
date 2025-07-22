import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2 } from "lucide-react";

export default function UserSignup() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: {
            email_confirm: false,
          },
        },
      });

      if (error) {
        if (error.message.includes("Invalid email") || error.message.includes("invalid email")) {
          setError("Please enter a valid email");
        } else if (error.message.includes("rate limit")) {
          setError("Too many requests. Please try again in a few minutes");
        } else if (error.message.includes("already registered") || error.message.includes("already exists")) {
          setError("Account already exists – please log in.");
        } else {
          setError("An error occurred. Please try again");
        }
        return;
      }

      localStorage.setItem("userEmail", email);
      navigate("/email-verification/user");
      toast({
        title: "6-digit code sent",
        description: "Please check your email for the 6-digit verification code",
      });
    } catch (err) {
      setError("Network error. Please check your connection and try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/7f95dbab-b4f5-489e-b8ca-a597d22e9d62.png" alt="Usergy Logo" className="h-8 w-auto" />
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
                  Start Your Journey
                </h1>
                <div className="h-1 w-20 bg-gradient-to-r from-turquoise to-sky-blue mx-auto rounded-full"></div>
              </div>
            </div>
            <p className="text-xl font-semibold text-muted-foreground">
              Enter your email to unlock exclusive access and shape the future of AI.
            </p>
          </div>

          {/* Sign Up Form */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
            <form onSubmit={handleSignup} className="space-y-6">
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
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
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
                    Signing up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <a
                  href="/user-login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                >
                  Login here
                </a>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                By signing up, you agree to our{" "}
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