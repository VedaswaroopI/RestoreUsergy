import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ClientHeaderProps {
  isAuthenticated?: boolean;
}

export function ClientHeader({ isAuthenticated = false }: ClientHeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate("/client-login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to={isAuthenticated ? "/client-dashboard" : "/"} className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">
              Usergy
            </div>
            <div className="text-sm text-muted-foreground">.ai</div>
          </Link>
          
          {isAuthenticated ? (
            <nav className="flex items-center space-x-6">
              <Link 
                to="/client-dashboard" 
                className="text-sm font-medium text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Button 
                variant="default" 
                size="sm" 
                className="bg-primary hover:bg-primary/90"
                onClick={async () => {
                  try {
                    // Get current user session
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session) return;

                    // Get client data
                    const { data: clientData, error: clientError } = await supabase
                      .from("clients")
                      .select("id")
                      .eq("user_id", session.user.id)
                      .single();

                    if (clientError || !clientData) {
                      toast({
                        title: "Error",
                        description: "Unable to access client data.",
                        variant: "destructive",
                      });
                      return;
                    }

                    // Create a new project in Supabase
                    const { data: project, error } = await supabase
                      .from('projects')
                      .insert({
                        client_id: clientData.id,
                        name: 'Untitled Project',
                        description: '',
                        status: 'draft'
                      })
                      .select('id')
                      .single();

                    if (error) throw error;

                    // Navigate to the project creation workspace
                    navigate(`/client/create-project/${project.id}`);
                  } catch (error) {
                    console.error('Error creating project:', error);
                    toast({
                      title: "Error",
                      description: "Failed to create project. Please try again.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Create Project
              </Button>
              <Link 
                to="#" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Reports
              </Link>
              <Link 
                to="#" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Account Settings
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                Logout
              </Button>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Settings
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Help
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Manage Account
              </a>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}