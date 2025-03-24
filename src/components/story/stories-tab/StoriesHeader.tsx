
import React from "react";
import { Project } from "@/utils/story";
import StoryHistoryHeader from "../StoryHistoryHeader";
import ProjectSelector from "../ProjectSelector";

interface StoriesHeaderProps {
  projects: Project[];
  selectedProject: string | null;
  selectedProjectData: Project | null;
  setSelectedProject: (projectId: string | null) => void;
  onExport: () => void;
  loadProjects: () => void;
  loadStories: () => void;
  onProjectDeleted?: () => void;
}

const StoriesHeader: React.FC<StoriesHeaderProps> = ({
  projects,
  selectedProject,
  selectedProjectData,
  setSelectedProject,
  onExport,
  loadProjects,
  loadStories,
  onProjectDeleted
}) => {
  const handleProjectChange = (projectId: string | null) => {
    console.log("Project selected in StoriesHeader:", projectId);
    setSelectedProject(projectId);
    // Force immediate stories refresh when changing projects
    loadStories();
  };
  
  return (
    <>
      <StoryHistoryHeader 
        onExport={onExport}
        selectedProject={selectedProjectData} 
      />
      
      <div className="mb-6">
        <ProjectSelector 
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={handleProjectChange}
          onProjectCreated={loadProjects}
          onProjectDeleted={onProjectDeleted}
        />
      </div>
    </>
  );
};

export default StoriesHeader;
