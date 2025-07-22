import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UserSignup from "./pages/UserSignup";
import UserLogin from "./pages/UserLogin";
import EmailVerification from "./pages/EmailVerification";
import UserPortal from "./pages/UserPortal";
import UserProjects from "./pages/UserProjects";
import ProjectDetail from "./pages/ProjectDetail";
import UserPayments from "./pages/UserPayments";
import ClientSignup from "./pages/ClientSignup";
import ClientLogin from "./pages/ClientLogin";
import ClientEmailVerification from "./pages/ClientEmailVerification";
import ClientOnboardingComplete from "./pages/ClientOnboardingComplete";
import ClientDashboard from "./pages/ClientDashboard";
import ProjectCreation from "./pages/ProjectCreation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/user-signup" element={<UserSignup />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/email-verification/user" element={<EmailVerification />} />
          <Route path="/user-portal" element={<UserPortal />} />
          <Route path="/user-projects" element={<UserProjects />} />
          <Route path="/user-payments" element={<UserPayments />} />
          <Route path="/project/:projectId" element={<ProjectDetail />} />
          <Route path="/client-signup" element={<ClientSignup />} />
          <Route path="/client-login" element={<ClientLogin />} />
          <Route path="/client-email-verification" element={<ClientEmailVerification />} />
          <Route path="/client-onboarding-complete" element={<ClientOnboardingComplete />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/client/create-project/:projectId" element={<ProjectCreation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
