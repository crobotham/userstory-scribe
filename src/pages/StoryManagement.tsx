
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import StoryHistory from "@/components/StoryHistory";
import FooterSection from "@/components/home/FooterSection";
import { Loader2 } from "lucide-react";

const StoryManagement = () => {
  console.log("StoryManagement component rendering");
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Redirect unauthenticated users to home page
  useEffect(() => {
    console.log("StoryManagement auth check:", { user, loading, isPageLoading });
    if (!loading) {
      if (!user) {
        navigate("/");
      } else {
        // Give a slight delay to ensure components mount properly
        setTimeout(() => {
          setIsPageLoading(false);
        }, 500);
      }
    }
  }, [user, loading, navigate]);

  // Handle URL parameters for project selection
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const projectId = searchParams.get('projectId');
    
    if (projectId) {
      // Switch to stories tab and select the project
      console.log("URL contains projectId:", projectId);
      const event = new CustomEvent('switchToDashboardTab', {
        detail: { tab: 'stories', projectId }
      });
      window.dispatchEvent(event);
    }
  }, []);

  if (loading || isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header isDashboard={true} />
      
      <main className="flex-1">
        <div className="py-8 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Story Management
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              View, edit, and organize your user stories and projects
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <StoryHistory />
          </div>
        </div>
      </main>
      
      <FooterSection />
    </div>
  );
};

export default StoryManagement;
