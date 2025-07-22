import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/7f95dbab-b4f5-489e-b8ca-a597d22e9d62.png" alt="Usergy Logo" className="h-8 w-auto" />
            <span className="text-lg font-semibold text-foreground">Usergy</span>
          </div>
          <Link to="/user-signup">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-200">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
        <div className="w-full max-w-4xl text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-turquoise/20 via-sky-blue/20 to-coral/20 rounded-3xl blur-xl"></div>
              <div className="relative">
                <Sparkles className="h-20 w-20 text-primary mx-auto mb-6" />
                <h1 className="text-6xl font-black text-foreground mb-4">
                  Welcome to Usergy
                </h1>
                <div className="h-1 w-32 bg-gradient-to-r from-turquoise to-sky-blue mx-auto rounded-full"></div>
              </div>
            </div>
            
            <p className="text-2xl font-semibold text-muted-foreground max-w-2xl mx-auto">
              Shape the future of AI with exclusive access to cutting-edge tools and insights.
            </p>
          </div>

          {/* CTA Section */}
          <div className="space-y-4">
            <Link to="/user-signup">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-6 h-auto transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                Start Your AI Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Join thousands of AI explorers already on the platform
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <div className="h-12 w-12 rounded-full bg-turquoise/20 flex items-center justify-center mb-4 mx-auto">
                <div className="h-6 w-6 rounded-full bg-turquoise"></div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">AI-Powered Tools</h3>
              <p className="text-sm text-muted-foreground">
                Access cutting-edge AI tools designed to enhance your workflow
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <div className="h-12 w-12 rounded-full bg-sky-blue/20 flex items-center justify-center mb-4 mx-auto">
                <div className="h-6 w-6 rounded-full bg-sky-blue"></div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Exclusive Access</h3>
              <p className="text-sm text-muted-foreground">
                Be among the first to explore new AI capabilities and features
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <div className="h-12 w-12 rounded-full bg-coral/20 flex items-center justify-center mb-4 mx-auto">
                <div className="h-6 w-6 rounded-full bg-coral"></div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Shape the Future</h3>
              <p className="text-sm text-muted-foreground">
                Provide feedback and help shape the next generation of AI tools
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
};

export default Index;
