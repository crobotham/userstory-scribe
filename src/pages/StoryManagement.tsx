
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import ProjectManagement from "@/components/story/ProjectManagement";
import FooterSection from "@/components/home/FooterSection";
import { Loader2 } from "lucide-react";

const StoryManagement = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Redirect unauthenticated users to home page
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/");
      } else {
        // Give a larger delay to ensure components mount properly
        setTimeout(() => {
          setIsPageLoading(false);
        }, 1000);
      }
    }
  }, [user, loading, navigate]);

  if (loading || isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
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
              View, create, and organize your projects
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ProjectManagement onProjectsChanged={() => {}} />
          </div>
        </div>
      </main>
      
      <FooterSection />
    </div>
  );
};

export default StoryManagement;
