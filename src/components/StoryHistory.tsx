
import React, { useEffect } from "react";
import ProjectManagement from "./story/ProjectManagement";
import { useProjectManagement } from "@/hooks/useProjectManagement";

const StoryHistory: React.FC = () => {
  const { loadProjects } = useProjectManagement();
  
  useEffect(() => {
    console.log("StoryHistory - Component mounted, loading projects");
    loadProjects();
  }, [loadProjects]);
  
  return (
    <div>
      <ProjectManagement onProjectsChanged={loadProjects} />
    </div>
  );
};

export default StoryHistory;
