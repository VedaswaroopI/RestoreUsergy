import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Settings, LogOut, CreditCard, User, FolderOpen, Menu } from "lucide-react";

interface InternalHeaderProps {
  user: any;
  isProfileComplete?: boolean;
}

export default function InternalHeader({ user, isProfileComplete = true }: InternalHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogoClick = () => {
    if (user) {
      navigate(isProfileComplete ? '/user-projects' : '/user-portal');
    } else {
      navigate('/user-login');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/user-login');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group transition-all duration-300 hover:scale-[1.02]" 
            onClick={handleLogoClick}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-turquoise/20 to-sky-blue/20 rounded-lg blur-sm group-hover:blur-none transition-all duration-300"></div>
              <img 
                src="/lovable-uploads/7f95dbab-b4f5-489e-b8ca-a597d22e9d62.png" 
                alt="Usergy Logo" 
                className="relative h-10 w-auto rounded-lg transition-all duration-300 group-hover:scale-105" 
              />
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              Usergy
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link to={isProfileComplete ? "/user-projects" : "/user-portal"}>
              <Button 
                variant={isActive('/user-projects') ? "default" : "ghost"}
                size="sm"
                className={`flex items-center space-x-2 px-4 py-2 h-10 font-medium transition-all duration-300 hover:scale-105 ${
                  !isProfileComplete ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!isProfileComplete}
              >
                <FolderOpen className="h-4 w-4" />
                <span>Projects & Invites</span>
              </Button>
            </Link>
            <Link to="/user-portal">
              <Button 
                variant={isActive('/user-portal') ? "default" : "ghost"}
                size="sm"
                className={`flex items-center space-x-2 px-4 py-2 h-10 font-medium transition-all duration-300 hover:scale-105 ${
                  !isProfileComplete ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!isProfileComplete}
              >
                <User className="h-4 w-4" />
                <span>Account</span>
              </Button>
            </Link>
            
            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`flex items-center space-x-2 px-4 py-2 h-10 font-medium transition-all duration-300 hover:scale-105 ${
                    !isProfileComplete ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!isProfileComplete}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-48 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 border border-border shadow-lg"
              >
                <DropdownMenuItem asChild>
                  <Link 
                    to="/user-payments" 
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted/50 transition-colors duration-200"
                  >
                    <CreditCard className="h-4 w-4 mr-3" />
                    Payments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted/50 transition-colors duration-200 text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center space-x-2 px-3 py-2 h-10"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 border border-border shadow-lg"
              >
                <DropdownMenuItem asChild>
                  <Link 
                    to={isProfileComplete ? "/user-projects" : "/user-portal"} 
                    className={`flex items-center w-full px-3 py-2 text-sm hover:bg-muted/50 transition-colors duration-200 ${
                      !isProfileComplete ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FolderOpen className="h-4 w-4 mr-3" />
                    Projects & Invites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/user-portal" 
                    className={`flex items-center w-full px-3 py-2 text-sm hover:bg-muted/50 transition-colors duration-200 ${
                      !isProfileComplete ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/user-payments" 
                    className={`flex items-center w-full px-3 py-2 text-sm hover:bg-muted/50 transition-colors duration-200 ${
                      !isProfileComplete ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <CreditCard className="h-4 w-4 mr-3" />
                    Payments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-muted/50 transition-colors duration-200 text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}