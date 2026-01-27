import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Tasks from "@/pages/Tasks";
import Games from "@/pages/Games";
import Chat from "@/pages/Chat";
import Wellness from "@/pages/Wellness";
import FaceAnalyzer from "@/pages/FaceAnalyzer";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={() => { window.location.href = "/"; return null; }} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/games" component={Games} />
      <Route path="/chat" component={Chat} />
      <Route path="/wellness" component={Wellness} />
      <Route path="/face-analyzer" component={FaceAnalyzer} />
      {/* Add placeholders for other routes to prevent 404s during development */}
      <Route path="/profile" component={() => <Dashboard />} />
      <Route path="/music" component={() => <Dashboard />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
