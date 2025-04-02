
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import ProjectManagement from "@/components/story/ProjectManagement";
import FooterSection from "@/components/home/FooterSection";
import { Loader2 } from "lucide-react";

const StoryManagement = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Add state to force re-renders when needed

  // Function to force ProjectManagement component to re-mount
  const handleProjectsChanged = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Redirect unauthenticated users to home page
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/");
      } else {
        // Reduced delay to improve performance
        setTimeout(() => {
          setIsPageLoading(false);
        }, 300); // Reduced from 500ms to 300ms
      }
    }
  }, [user, loading, navigate]);

  // Check URL parameters for project selection
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const projectId = searchParams.get('projectId');
    
    if (projectId) {
      console.log("StoryManagement detected projectId in URL:", projectId);
      // Dispatch an event that ProjectManagement listens for
      const event = new CustomEvent('projectSelected', {
        detail: { projectId }
      });
      window.dispatchEvent(event);
    }
  }, [location.search]); // Only depend on location.search to prevent re-runs

  if (loading || isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground">Loading your projects...</p>
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
              Project Management
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              View, create, and organize your projects and stories
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ProjectManagement 
              key={refreshKey} 
              onProjectsChanged={handleProjectsChanged} 
            />
          </div>
        </div>
      </main>
      
      <FooterSection />
    </div>
  );
};

export default StoryManagement;
