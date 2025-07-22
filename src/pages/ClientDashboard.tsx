import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ClientHeader } from "@/components/ClientHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Users, 
  Target, 
  BarChart3, 
  Plus,
  Calendar,
  UserCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  Rocket,
  Zap,
  MoreVertical
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  launch_date: string;
  target_testers: number;
  current_testers: number;
  created_at: string;
}

interface ClientData {
  id: string;
  name: string;
  company_name: string;
  company_url: string;
  email: string;
}

export default function ClientDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/client-login");
        return;
      }

      setUser(session.user);

      // Get client data
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (clientError || !clientData) {
        toast({
          title: "Access Error",
          description: "Unable to load client data. Please contact support.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        navigate("/client-login");
        return;
      }

      setClientData(clientData);

      // Get projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("client_id", clientData.id)
        .order("created_at", { ascending: false });

      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
      } else {
        setProjects(projectsData || []);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      navigate("/client-login");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'recruiting':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'in progress':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'awaiting feedback':
        return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'completed':
        return 'bg-green-500/10 text-green-700 border-green-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'recruiting':
        return <Users className="h-3 w-3" />;
      case 'in progress':
        return <Clock className="h-3 w-3" />;
      case 'awaiting feedback':
        return <Target className="h-3 w-3" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <BarChart3 className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => 
    p.status.toLowerCase() === 'recruiting' || p.status.toLowerCase() === 'in progress'
  ).length;
  const totalUsers = projects.reduce((sum, p) => sum + p.current_testers, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <ClientHeader isAuthenticated={true} />
      
      <div className="mx-auto max-w-7xl px-4 py-8">
        {projects.length === 0 ? (
          // "Mission Brief" - Empty State Redesign
          <motion.div 
            className="flex items-center justify-center min-h-[calc(100vh-200px)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center space-y-8 max-w-3xl">
              {/* Enhanced Background Illustration */}
              <motion.div 
                className="relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-sky-blue/5 to-turquoise/10 rounded-full blur-3xl transform scale-150 animate-pulse-glow"></div>
                <motion.div 
                  className="relative living-card rounded-full p-20 mx-auto w-80 h-80 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gradient-to-br from-primary/20 to-turquoise/30 rounded-full p-10 shadow-xl">
                    <Rocket className="h-20 w-20 text-primary mx-auto animate-float" />
                  </div>
                </motion.div>
              </motion.div>

              {/* Mission Brief Content */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-sky-blue to-turquoise bg-clip-text text-transparent">
                  Ready to Launch Your Mission?
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Your Command Center is standing by. Define your first project, recruit your elite users, and gather the critical feedback you need to succeed.
                </p>
              </motion.div>

              {/* Enhanced Primary CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Button 
                  variant="premium"
                  size="xl"
                  className="animate-pulse-glow hover-lift active-press"
                  onClick={async () => {
                    try {
                      if (!clientData) return;

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
                  <Rocket className="mr-3 h-6 w-6" />
                  Initiate First Project
                  <Zap className="ml-3 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          // Command Center - Active State
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Command Center Header */}
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Command Center
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                  Welcome back, {clientData?.name} • Mission Status: Active
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="premium"
                  size="lg"
                  className="hover-lift active-press"
                  onClick={async () => {
                    try {
                      if (!clientData) return;

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
                  <Plus className="mr-2 h-5 w-5" />
                  Launch New Project
                  <Rocket className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Mission Control Stats */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="living-card hover-lift group">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        Total Projects
                      </CardTitle>
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <BarChart3 className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                      {totalProjects}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="living-card hover-lift group">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        Active Projects
                      </CardTitle>
                      <div className="p-2 bg-turquoise/10 rounded-lg group-hover:bg-turquoise/20 transition-colors">
                        <TrendingUp className="h-4 w-4 text-turquoise" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-turquoise bg-clip-text text-transparent">
                      {activeProjects}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="living-card hover-lift group">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        Total Users Engaged
                      </CardTitle>
                      <div className="p-2 bg-sky-blue/10 rounded-lg group-hover:bg-sky-blue/20 transition-colors">
                        <Users className="h-4 w-4 text-sky-blue" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-sky-blue bg-clip-text text-transparent">
                      {totalUsers}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Mission Status - Active Projects */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Mission Status
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card className="living-card hover-lift cursor-pointer group relative overflow-hidden">
                      {/* Progress Bar */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-primary to-turquoise"
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${project.target_testers > 0 ? (project.current_testers / project.target_testers) * 100 : 0}%` 
                          }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>

                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                              {project.name}
                            </h3>
                            <Badge 
                              variant="outline" 
                              className={`text-xs font-medium ${getStatusColor(project.status)}`}
                            >
                              {getStatusIcon(project.status)}
                              <span className="ml-1 capitalize">{project.status}</span>
                            </Badge>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 rounded-full hover:bg-muted transition-colors"
                          >
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </motion.button>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {project.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(project.launch_date || project.created_at)}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <div className="flex -space-x-1">
                              {/* User Avatars Stack */}
                              {Array.from({ length: Math.min(project.current_testers, 3) }).map((_, i) => (
                                <div
                                  key={i}
                                  className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-turquoise border-2 border-background flex items-center justify-center text-xs text-white font-medium"
                                >
                                  {i + 1}
                                </div>
                              ))}
                              {project.current_testers > 3 && (
                                <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                                  +{project.current_testers - 3}
                                </div>
                              )}
                            </div>
                            <span>{project.current_testers} / {project.target_testers} Users</span>
                          </div>
                        </div>

                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground hover-lift active-press transition-all"
                        >
                          View Project
                          <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}