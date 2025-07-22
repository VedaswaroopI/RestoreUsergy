import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, Calendar, Search, Award, Sparkles, Lightbulb, Zap, TrendingUp, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import InternalHeader from "@/components/InternalHeader";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  deadline?: string;
  reward?: number;
  completionDate?: string;
}

export default function UserProjects() {
  const [activeTab, setActiveTab] = useState("current");
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Dynamic data - in production this would come from Supabase
  const [currentProjects, setCurrentProjects] = useState<Project[]>([
    {
      id: "ai-voice-assistant-beta",
      name: "AI Voice Assistant Beta",
      description: "Test the new voice command recognition and natural language understanding for a smart home AI assistant.",
      status: "Live",
      deadline: "2025-01-30",
      reward: 500
    },
    {
      id: "mobile-app-usability-test",
      name: "Mobile App Usability Test",
      description: "Evaluate the user experience of a new mobile banking application focusing on accessibility and ease of use.",
      status: "In Progress",
      deadline: "2025-02-15",
      reward: 350
    }
  ]);
  
  const [publicProjects, setPublicProjects] = useState<Project[]>([
    {
      id: "ai-voice-assistant-beta",
      name: "AI Voice Assistant Beta",
      description: "Test the new voice command recognition and natural language understanding for a smart home AI assistant.",
      status: "Live",
      deadline: "2025-01-30",
      reward: 500
    },
    {
      id: "e-commerce-checkout-flow",
      name: "E-commerce Checkout Flow",
      description: "Review and test the checkout process for an online marketplace, focusing on payment integration and user flow.",
      status: "Live",
      deadline: "2025-02-10",
      reward: 400
    },
    {
      id: "fitness-app-beta",
      name: "Fitness App Beta Testing",
      description: "Test a new fitness tracking application with AI-powered workout recommendations and progress tracking.",
      status: "Live",
      deadline: "2025-02-20",
      reward: 450
    }
  ]);
  
  const [pastProjects, setPastProjects] = useState<Project[]>([
    {
      id: "social-media-analytics",
      name: "Social Media Analytics Tool",
      description: "Tested a comprehensive analytics dashboard for social media management.",
      status: "Completed",
      completionDate: "2024-12-15",
      reward: 300
    }
  ]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        navigate('/user-login');
        return;
      }

      if (!session) {
        navigate('/user-login');
        return;
      }

      setUser(session.user);
      
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error in checkAuth:', error);
      navigate('/user-login');
    } finally {
      setLoading(false);
    }
  };


  const EmptyState = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-turquoise/20 via-sky-blue/20 to-coral/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="relative bg-gradient-to-r from-turquoise/10 to-sky-blue/10 p-10 rounded-full border border-primary/20">
          <Icon className="h-20 w-20 text-primary animate-pulse" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground text-center max-w-lg text-lg leading-relaxed">{description}</p>
    </div>
  );

  const ProjectCard = ({ project, type }: { project: Project, type: 'current' | 'public' | 'past' }) => (
    <Card 
      className="group hover:shadow-xl transition-all duration-500 hover:scale-[1.03] border border-border/50 hover:border-primary/50 cursor-pointer overflow-hidden bg-gradient-to-br from-background via-background to-primary/5"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-turquoise via-sky-blue to-coral"></div>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {project.name}
          </CardTitle>
          {type === 'current' && (
            <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-turquoise/20 to-sky-blue/20 text-turquoise rounded-full border border-turquoise/30">
              {project.status}
            </span>
          )}
          {type === 'past' && project.reward && (
            <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-coral/20 to-coral/10 text-coral rounded-full border border-coral/30">
              {project.reward} pts
            </span>
          )}
        </div>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed mt-2">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm">
          {type === 'current' && project.deadline && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Due: {project.deadline}</span>
            </div>
          )}
          {type === 'public' && project.reward && (
            <div className="flex items-center gap-2 text-primary font-medium">
              <Award className="h-4 w-4" />
              <span>{project.reward} points</span>
            </div>
          )}
          {type === 'past' && project.completionDate && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Completed: {project.completionDate}</span>
            </div>
          )}
          {type === 'public' && (
            <Button 
              size="sm" 
              className="ml-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/project/${project.id}`);
              }}
            >
              Apply
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-inter flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <InternalHeader user={user} isProfileComplete={true} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Dynamic Welcome Message */}
          <div className="mb-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-turquoise/20 via-sky-blue/20 to-coral/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gradient-to-r from-turquoise/5 via-sky-blue/5 to-coral/5 p-10 rounded-3xl border border-primary/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-r from-turquoise/20 to-sky-blue/20 p-3 rounded-full">
                    <Zap className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-black text-foreground mb-2">
                      Welcome Back, {userProfile?.first_name || 'Explorer'}!
                    </h1>
                    <p className="text-xl text-muted-foreground">
                      Your exploration hub awaits new discoveries.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span>{currentProjects.length} Active Projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>{publicProjects.length} Available Opportunities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="w-full h-auto bg-background border border-border rounded-2xl p-2 shadow-lg grid grid-cols-3 gap-2">
              <TabsTrigger
                value="current"
                className="flex items-center justify-center h-14 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ease-out select-none data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-turquoise data-[state=active]:to-sky-blue data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 data-[state=active]:scale-[1.02] data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/50 data-[state=inactive]:hover:scale-[1.01]"
              >
                <Users className="w-5 h-5 mr-2" />
                Your Projects & Invites
              </TabsTrigger>
              <TabsTrigger
                value="public"
                className="flex items-center justify-center h-14 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ease-out select-none data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-turquoise data-[state=active]:to-sky-blue data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 data-[state=active]:scale-[1.02] data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/50 data-[state=inactive]:hover:scale-[1.01]"
              >
                <Search className="w-5 h-5 mr-2" />
                Browse Public Project Listings
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="flex items-center justify-center h-14 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ease-out select-none data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-turquoise data-[state=active]:to-sky-blue data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 data-[state=active]:scale-[1.02] data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted/50 data-[state=inactive]:hover:scale-[1.01]"
              >
                <Award className="w-5 h-5 mr-2" />
                Your Past Projects
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="current" className="space-y-6 animate-fade-in">
              {currentProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} type="current" />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Sparkles}
                  title="No projects available at the moment"
                  description="Keep your profile updated, and exciting opportunities will land here soon!"
                />
              )}
            </TabsContent>

            <TabsContent value="public" className="space-y-6 animate-fade-in">
              {publicProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publicProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} type="public" />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Lightbulb}
                  title="No tests available"
                  description="Exciting opportunities will land here soon!"
                />
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6 animate-fade-in">
              {pastProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} type="past" />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Clock}
                  title="No Project History"
                  description="Your completed projects will appear here once you start participating."
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-16">
        <div className="container flex h-16 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Usergy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}