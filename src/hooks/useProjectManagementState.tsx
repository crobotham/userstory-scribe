
import { useState, useEffect, useCallback } from "react";
import { 
  Project,
  UserStory,
  getProjectsFromLocalStorage,
  getStoriesByProject
} from "@/utils/story";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProjectCreate } from "./useProjectCreate";
import { useProjectUpdate } from "./useProjectUpdate";
import { useProjectDelete } from "./useProjectDelete";
import { useStoryCounts } from "./useStoryCounts";

export const useProjectManagementState = (onProjectsChanged: () => void) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectStories, setProjectStories] = useState<UserStory[]>([]);
  const [isLoadingStories, setIsLoadingStories] = useState(false);
  const { toast } = useToast();
  
  // Use callback to ensure stability of the function reference
  const loadProjects = useCallback(async () => {
    console.log("Loading projects in useProjectManagementState");
    setIsLoading(true);
    try {
      const loadedProjects = await getProjectsFromLocalStorage();
      loadedProjects.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setProjects(loadedProjects);
      onProjectsChanged();
      console.log("Projects loaded successfully:", loadedProjects.length);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast({
        title: "Error loading projects",
        description: "There was a problem loading your projects.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [onProjectsChanged, toast]);
  
  // Load projects on mount
  useEffect(() => {
    loadProjects();
    
    const handleProjectSelected = (event: CustomEvent) => {
      const { projectId } = event.detail;
      console.log("Project selected event received for project:", projectId);
      const project = projects.find(p => p.id === projectId);
      if (project) {
        handleProjectSelect(project);
      }
    };
    
    window.addEventListener('projectSelected', handleProjectSelected as EventListener);
    
    return () => {
      window.removeEventListener('projectSelected', handleProjectSelected as EventListener);
    };
  }, [loadProjects, projects]);

  // Get project IDs for story count hook
  const projectIds = projects.map(project => project.id);
  
  // Use the new story counts hook
  const { storyCounts } = useStoryCounts(projectIds);

  const handleProjectSelect = useCallback(async (project: Project) => {
    console.log("Selecting project:", project.name);
    setSelectedProject(project);
    await loadProjectStories(project.id);
  }, []);

  const loadProjectStories = async (projectId: string) => {
    setIsLoadingStories(true);
    try {
      const stories = await getStoriesByProject(projectId);
      setProjectStories(stories);
    } catch (error) {
      console.error("Error loading project stories:", error);
      toast({
        title: "Error loading stories",
        description: "There was a problem loading stories for this project.",
        variant: "destructive",
      });
      setProjectStories([]);
    } finally {
      setIsLoadingStories(false);
    }
  };

  const handleBackToProjects = useCallback(() => {
    console.log("Navigating back to projects list");
    setSelectedProject(null);
    setProjectStories([]);
    // Force a reload of projects when returning to project list
    loadProjects();
  }, [loadProjects]);
  
  // Initialize the specialized hooks
  const projectCreate = useProjectCreate(loadProjects);
  const projectUpdate = useProjectUpdate(loadProjects);
  const projectDelete = useProjectDelete(loadProjects);
  
  return {
    // Project list state
    projects,
    isLoading,
    storyCounts,
    
    // Selected project state
    selectedProject,
    projectStories,
    isLoadingStories,
    
    // Project creation state and handlers
    isNewProjectDialogOpen: projectCreate.isCreateDialogOpen,
    setIsNewProjectDialogOpen: projectCreate.setIsCreateDialogOpen,
    handleCreateProject: projectCreate.handleCreateProject,
    
    // Project update state and handlers
    projectToEdit: projectUpdate.projectToEdit,
    setProjectToEdit: projectUpdate.setProjectToEdit,
    handleUpdateProject: projectUpdate.handleUpdateProject,
    
    // Project delete state and handlers
    projectToDelete: projectDelete.projectToDelete,
    isDeleteDialogOpen: projectDelete.isDeleteDialogOpen,
    setProjectToDelete: projectDelete.setProjectToDelete,
    setIsDeleteDialogOpen: projectDelete.setIsDeleteDialogOpen,
    handleDeleteProject: projectDelete.handleDeleteProject,
    
    // Project navigation
    handleProjectSelect,
    handleBackToProjects,
    
    // Data loading
    loadProjects
  };
};
