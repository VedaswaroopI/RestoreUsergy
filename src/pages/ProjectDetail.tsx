import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  CheckSquare, 
  Bug, 
  MessageCircle, 
  Calendar, 
  Award,
  User,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectInstructions from "@/components/project/ProjectInstructions";
import ProjectTasks from "@/components/project/ProjectTasks";
import ProjectBugs from "@/components/project/ProjectBugs";
import ProjectMessages from "@/components/project/ProjectMessages";

// Dummy project data for testing
const dummyProject = {
  id: "ai-voice-assistant-beta",
  name: "AI Voice Assistant Beta",
  client: "Innovate AI Labs",
  description: "Test the new voice command recognition and natural language understanding for a smart home AI assistant.",
  status: "Live",
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  reward: 500,
  instructions: [
    "Access the beta app here: [dummy app link]",
    "Complete the voice setup tutorial.",
    "Test 10 voice commands from the provided list.",
    "Record any misinterpretations or delays.",
    "Complete the short survey on voice clarity."
  ],
  tasks: [
    {
      id: "1",
      name: "Complete Onboarding Survey",
      status: "Not Started",
      dueDate: "2024-01-15",
      reward: 50
    },
    {
      id: "2",
      name: "Record Feature X Video",
      status: "In Progress",
      dueDate: "2024-01-20",
      reward: 100
    }
  ],
  bugs: [
    {
      id: "1",
      title: "Voice Assistant crashes when asked 'Play jazz music'",
      severity: "High",
      reproducibility: "Always",
      reportedBy: "User Alpha",
      status: "New"
    },
    {
      id: "2",
      title: "Assistant misunderstands 'set alarm for 7 AM' as 'set alarm for 7 PM'",
      severity: "Medium",
      reproducibility: "Sometimes",
      reportedBy: "User Beta",
      status: "Under Review"
    }
  ],
  messages: [
    {
      id: "1",
      title: "Project Launch Announcement",
      content: "Welcome to the AI Voice Assistant Beta project! Please read all instructions carefully.",
      date: "2024-01-01",
      author: "Project Manager"
    }
  ]
};

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("instructions");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/user-login");
          return;
        }
        setUser(session.user);
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/user-login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate("/user-login");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "live":
        return "bg-green-500";
      case "in progress":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/user-projects")}
                className="hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
              <div className="h-6 w-px bg-border"></div>
              <h1 className="text-xl font-semibold text-foreground">Usergy</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.email?.split('@')[0] || 'Explorer'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => supabase.auth.signOut()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Navigation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab("instructions")}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === "instructions"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <FileText className="h-4 w-4 mr-3" />
                    Instructions
                  </button>
                  <button
                    onClick={() => setActiveTab("tasks")}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === "tasks"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <CheckSquare className="h-4 w-4 mr-3" />
                    Tasks & Surveys
                  </button>
                  <button
                    onClick={() => setActiveTab("bugs")}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === "bugs"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Bug className="h-4 w-4 mr-3" />
                    Bugs
                  </button>
                  <button
                    onClick={() => setActiveTab("messages")}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === "messages"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <MessageCircle className="h-4 w-4 mr-3" />
                    Messages
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Project Overview */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{dummyProject.name}</CardTitle>
                    <p className="text-muted-foreground mb-4">{dummyProject.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {dummyProject.client}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {dummyProject.startDate} - {dummyProject.endDate}
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        {dummyProject.reward} Points
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(dummyProject.status)} text-white`}>
                    {dummyProject.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Dynamic Content Based on Active Tab */}
            <div className="animate-fade-in">
              {activeTab === "instructions" && (
                <ProjectInstructions project={dummyProject} />
              )}
              {activeTab === "tasks" && (
                <ProjectTasks tasks={dummyProject.tasks} />
              )}
              {activeTab === "bugs" && (
                <ProjectBugs bugs={dummyProject.bugs} projectName={dummyProject.name} />
              )}
              {activeTab === "messages" && (
                <ProjectMessages messages={dummyProject.messages} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;