
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import QuestionFlow from "@/components/QuestionFlow";
import FooterSection from "@/components/home/FooterSection";
import NewsBanner from "@/components/dashboard/NewsBanner";
import { Loader2 } from "lucide-react";
import { ToastProvider } from "@/contexts/ToastContext";
import { Toaster } from "@/components/ui/toaster";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect unauthenticated users to home page
  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  // Check URL parameters for project selection - run only once when component mounts
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const projectId = searchParams.get('projectId');
    
    if (projectId) {
      console.log("Dashboard detected projectId in URL:", projectId);
      // Dispatch an event that QuestionFlow listens for
      const event = new CustomEvent('projectSelected', {
        detail: { projectId }
      });
      window.dispatchEvent(event);
    }
  }, [location.search]); // Only depend on location.search to prevent re-runs

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header isDashboard={true} />
        
        <main className="flex-1">
          <NewsBanner />
          
          <div className="py-8 px-4 max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                User Story Generator
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Create comprehensive user stories to guide your development process
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <QuestionFlow />
            </div>
          </div>
        </main>
        
        <FooterSection />
        <Toaster />
      </div>
    </ToastProvider>
  );
};

export default Dashboard;
