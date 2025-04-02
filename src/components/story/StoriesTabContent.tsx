import React, { useEffect } from "react";
import { UserStory, Project, deleteProjectFromLocalStorage } from "@/utils/story";
import StoriesHeader from "./stories-tab/StoriesHeader";
import StoriesContent from "./stories-tab/StoriesContent";
import { useStoriesTabHelpers } from "@/hooks/story/useStoriesTabHelpers";
import { useToast } from "@/hooks/use-toast";

interface StoriesTabContentProps {
  stories: UserStory[];
  projects: Project[];
  selectedProject: string | null;
  setSelectedProject: (projectId: string | null) => void;
  onEditClick: (story: UserStory) => void;
  onDeleteClick: (storyId: string) => void;
  loadProjects: () => void;
  loadStories: () => void;
  isLoading: boolean;
}

const StoriesTabContent: React.FC<StoriesTabContentProps> = ({
  stories,
  projects,
  selectedProject,
  setSelectedProject,
  onEditClick,
  onDeleteClick,
  loadProjects,
  loadStories,
  isLoading
}) => {
  const { toast } = useToast();
  
  // Log component state for debugging
  useEffect(() => {
    console.log("StoriesTabContent - Props:", { 
      storiesCount: stories.length,
      projectsCount: projects.length,
      selectedProject,
      isLoading
    });
  }, [stories, projects, selectedProject, isLoading]);
  
  const {
    selectedProjectData,
    handleExport,
    handleCreateProject
  } = useStoriesTabHelpers(selectedProject, stories, loadProjects, setSelectedProject);

  const handleDeleteProject = async () => {
    if (selectedProject) {
      try {
        await deleteProjectFromLocalStorage(selectedProject);
        loadProjects(); // Reload projects after deletion
        loadStories(); // Reload stories to update the view
      } catch (error) {
        console.error("Error deleting project:", error);
        toast({
          title: "Error deleting project",
          description: "There was a problem deleting the project",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <>
      <StoriesHeader
        projects={projects}
        selectedProject={selectedProject}
        selectedProjectData={selectedProjectData}
        setSelectedProject={setSelectedProject}
        onExport={handleExport}
        loadProjects={loadProjects}
        loadStories={loadStories}
        onProjectDeleted={handleDeleteProject}
      />
      
      <StoriesContent
        projects={projects}
        stories={stories}
        isLoading={isLoading}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
        onCreateProject={handleCreateProject}
      />
    </>
  );
};

export default StoriesTabContent;
