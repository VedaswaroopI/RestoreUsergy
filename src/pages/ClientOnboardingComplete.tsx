import { ClientHeader } from "@/components/ClientHeader";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Users, Target, BarChart3 } from "lucide-react";
// Using the onboarding complete illustration from public folder

export default function ClientOnboardingComplete() {
  return (
    <div className="min-h-screen bg-background">
      <ClientHeader />
      
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left side - Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="space-y-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-green-500/10 p-4 rounded-full">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-card-foreground">
                  Welcome to Usergy.ai!
                </h1>
                <p className="mt-3 text-lg text-muted-foreground">
                  Your account has been successfully created and verified
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-card/50 rounded-xl p-6 border border-border">
                  <h2 className="text-lg font-semibold text-card-foreground mb-4">
                    What's next?
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-card-foreground">
                          Connect with Users
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Access our vetted community of real users for testing
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <Target className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-card-foreground">
                          Create Your First Project
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Set up your first user research project
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <BarChart3 className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-card-foreground">
                          Get AI-Powered Insights
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Analyze results with our intelligent tools
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Need help getting started?{" "}
                  <a href="#" className="font-medium text-primary hover:underline transition-colors">
                    Contact Support
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Illustration */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-green-500/5 to-primary/10 relative overflow-hidden p-8">
          <div className="relative z-10 w-full max-w-2xl">
            <img
              src="/lovable-uploads/e92abc17-f698-4492-9562-f788ad4d62e4.png"
              alt="Onboarding Complete - Welcome to Usergy.ai"
              className="w-full h-auto object-contain animate-fade-in"
            />
          </div>
          
          {/* Floating elements */}
          <div className="absolute inset-0">
            <div className="absolute top-16 right-16 w-24 h-24 bg-green-500/5 rounded-full animate-pulse"></div>
            <div className="absolute bottom-24 left-20 w-16 h-16 bg-primary/8 rounded-full animate-pulse animation-delay-1000"></div>
            <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-green-500/10 rounded-full animate-pulse animation-delay-2000"></div>
          </div>
        </div>
      </div>
    </div>
  );
}