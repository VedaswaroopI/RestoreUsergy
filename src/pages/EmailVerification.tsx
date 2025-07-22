import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2, RotateCcw, Lock, Eye, EyeOff } from "lucide-react";
import { validatePassword } from "@/utils/authHelpers";

export default function EmailVerification() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"verification" | "password">("verification");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      navigate("/user-signup");
    }
  }, [navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });

      if (error) {
        if (error.message.includes("Invalid token")) {
          setError("Incorrect OTP");
        } else if (error.message.includes("expired")) {
          setError("Verification code has expired. Please request a new one");
        } else {
          setError("Verification failed. Please try again");
        }
        return;
      }

      // OTP verified successfully, move to password creation step
      setStep("password");
      toast({
        title: "Email verified successfully!",
        description: "Now create your password to complete registration",
      });
    } catch (err) {
      setError("Network error. Please check your connection and try again");
    } finally {
      setIsLoading(false);
    }
  };


  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    // Validate password
    const validation = validatePassword(password);
    if (!validation.isValid) {
      const errorMessages = Object.values(validation.errors).filter(Boolean);
      setError(errorMessages.join(". "));
      setIsSaving(false);
      return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSaving(false);
      return;
    }

    try {
      // Update user password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        setError("Failed to set password. Please try again");
        setIsSaving(false);
        return;
      }

      // Check if user profile exists to determine redirect
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        localStorage.removeItem("userEmail");
        
        if (profile) {
          // Profile exists, go to projects
          navigate("/user-projects");
        } else {
          // No profile, go to portal for profile completion
          navigate("/user-portal");
        }
      }

      toast({
        title: "Registration complete!",
        description: "Your account has been created successfully",
      });
    } catch (err) {
      setError("Network error. Please check your connection and try again");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError("");

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
        if (error.message.includes("rate limit")) {
          setError("Too many requests. Please try again in a few minutes");
        } else {
          setError("Failed to resend code. Please try again");
        }
        return;
      }

      toast({
        title: "6-digit code resent",
        description: "Please check your email for the new 6-digit verification code (valid for 1 hour)",
      });
    } catch (err) {
      setError("Network error. Please check your connection and try again");
    } finally {
      setIsResending(false);
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
                  Verify Your Email
                </h1>
                <div className="h-1 w-20 bg-gradient-to-r from-turquoise to-sky-blue mx-auto rounded-full"></div>
              </div>
            </div>
            <p className="text-xl font-semibold text-muted-foreground">
              {step === "verification" ? (
                <>
                  We've sent a 6-digit verification code to{" "}
                  <span className="text-primary font-semibold">
                    {email || "your email address"}
                  </span>
                </>
              ) : (
                "Set up a secure password to complete your account"
              )}
            </p>
          </div>

          {/* Verification or Password Form */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
            {step === "verification" ? (
              <>
                <form onSubmit={handleVerify} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-sm font-medium text-foreground">
                      Verification Code <span className="text-coral">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="code"
                        type="tel"
                        placeholder="Enter 6-digit code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        maxLength={6}
                        required
                        className="pl-10 h-12 text-center text-lg font-mono tracking-wider transition-all duration-200 focus:ring-2 focus:ring-primary placeholder:opacity-60"
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
                    disabled={isLoading || code.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Didn't receive the code?
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="text-primary border-primary hover:bg-primary/10 transition-all duration-200"
                  >
                    {isResending ? (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                        Resending...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Resend Code
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Create Your Password
                  </h2>
                  <p className="text-muted-foreground">
                    Complete your registration by setting up a secure password
                  </p>
                </div>

                <form onSubmit={handlePasswordSave} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">
                      Password <span className="text-coral">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 pr-10 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary placeholder:opacity-60"
                        disabled={isSaving}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Must be at least 8 characters with one number and one symbol
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                      Confirm Password <span className="text-coral">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="pl-10 pr-10 h-12 transition-all duration-200 focus:ring-2 focus:ring-primary placeholder:opacity-60"
                        disabled={isSaving}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {error && (
                      <p className="text-sm text-destructive font-medium">{error}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    disabled={isSaving || !password || !confirmPassword}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Save Password"
                    )}
                  </Button>
                </form>
              </>
            )}
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