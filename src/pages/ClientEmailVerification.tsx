import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ClientHeader } from "@/components/ClientHeader";
import { Loader2, Mail, Shield, Clock } from "lucide-react";
// Using uploaded illustration from public folder

export default function ClientEmailVerification() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from session storage
    const storedEmail = sessionStorage.getItem("client-verification-email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email in storage, redirect to signup
      navigate("/client-signup");
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit code");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "signup",
      });

      if (error) {
        setError("Invalid or expired code");
      } else {
        // Clear the stored email
        sessionStorage.removeItem("client-verification-email");
        navigate("/client-onboarding-complete");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/client-email-verification`,
        },
      });

      if (error) {
        setError("Failed to resend code. Please try again.");
      } else {
        setCanResend(false);
        setResendTimer(60);
        
        // Restart timer
        const timer = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
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
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-card-foreground">
                  Check Your Inbox
                </h1>
                <p className="mt-3 text-lg text-muted-foreground">
                  We sent a 6-digit code to
                </p>
                <p className="text-base font-medium text-card-foreground mt-1">
                  {email}
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <Label htmlFor="code" className="text-sm font-medium text-card-foreground block mb-2">
                    Verification Code
                  </Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="h-14 text-xl text-center tracking-widest font-mono border-input focus:border-primary focus:ring-primary/20 transition-all duration-200"
                    maxLength={6}
                    required
                  />
                </div>

                {error && (
                  <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-xl border border-destructive/20 animate-fade-in">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive it?{" "}
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="font-medium text-primary hover:underline transition-colors"
                        disabled={loading}
                      >
                        Resend Code
                      </button>
                    ) : (
                      <span className="inline-flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Resend in <span className="font-medium ml-1">{resendTimer}s</span>
                      </span>
                    )}
                  </p>
                </div>
              </form>

              {/* Security info */}
              <div className="pt-6 border-t border-border">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Your email is secure and will never be shared</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Illustration */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden p-8">
          <div className="relative z-10 w-full max-w-2xl">
            <img
              src="/lovable-uploads/e547f173-31d8-4a24-91e6-75f77d07cde8.png"
              alt="Email Verification"
              className="w-full h-auto object-contain animate-fade-in"
            />
          </div>
          
          {/* Floating elements */}
          <div className="absolute inset-0">
            <div className="absolute top-24 left-20 w-20 h-20 bg-primary/8 rounded-full animate-pulse"></div>
            <div className="absolute bottom-40 right-24 w-14 h-14 bg-primary/12 rounded-full animate-pulse animation-delay-1000"></div>
            <div className="absolute top-1/3 left-1/3 w-10 h-10 bg-primary/6 rounded-full animate-pulse animation-delay-2000"></div>
          </div>
        </div>
      </div>
    </div>
  );
}