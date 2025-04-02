
import { useState, useEffect } from "react";
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

export const useProjectManagementState = (onProjectsChanged: () => void) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectStories, setProjectStories] = useState<UserStory[]>([]);
  const [isLoadingStories, setIsLoadingStories] = useState(false);
  const [storyCounts, setStoryCounts] = useState<Record<string, number>>({});
  const { toast } = useToast();
  
  // Load projects on mount
  useEffect(() => {
    loadProjects();
    
    const handleProjectSelected = (event: CustomEvent) => {
      const { projectId } = event.detail;
      const project = projects.find(p => p.id === projectId);
      if (project) {
        handleProjectSelect(project);
      }
    };
    
    window.addEventListener('projectSelected', handleProjectSelected as EventListener);
    
    return () => {
      window.removeEventListener('projectSelected', handleProjectSelected as EventListener);
    };
  }, []);

  // Load story counts when projects change
  useEffect(() => {
    if (projects.length > 0) {
      loadStoryCounts();
    }
  }, [projects]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const loadedProjects = await getProjectsFromLocalStorage();
      loadedProjects.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setProjects(loadedProjects);
      onProjectsChanged();
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
  };

  const loadStoryCounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const counts: Record<string, number> = {};
      
      for (const project of projects) {
        counts[project.id] = 0;
        const { data, error } = await supabase
          .from('user_stories')
          .select('id')
          .eq('user_id', user.id)
          .eq('project_id', project.id);

        if (error) {
          console.error(`Error fetching stories for project ${project.id}:`, error);
          continue;
        }

        if (data) {
          counts[project.id] = data.length;
        }
      }

      setStoryCounts(counts);
    } catch (error) {
      console.error("Error loading story counts:", error);
    }
  };

  const handleProjectSelect = async (project: Project) => {
    setSelectedProject(project);
    await loadProjectStories(project.id);
  };

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

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setProjectStories([]);
  };
  
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
