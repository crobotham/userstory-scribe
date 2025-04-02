
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectManagement from "./story/ProjectManagement";
import { useProjectManagement } from "@/hooks/useProjectManagement";

const StoryHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("projects");
  
  const { 
    loadProjects
  } = useProjectManagement();
  
  useEffect(() => {
    console.log("StoryHistory - Component mounted, loading projects");
    loadProjects();
  }, [loadProjects]);
  
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight mb-6">Project Management</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ProjectManagement onProjectsChanged={loadProjects} />
      </div>
    </div>
  );
};

export default StoryHistory;
