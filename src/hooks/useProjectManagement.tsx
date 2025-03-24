
import { useState, useEffect, useCallback } from "react";
import { 
  Project,
  getProjectsFromLocalStorage,
  createProject,
  getProjectById
} from "@/utils/story";
import { useToast } from "@/contexts/ToastContext";

export const useProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [projectSelected, setProjectSelected] = useState(false);
  const [hasProcessedProjectId, setHasProcessedProjectId] = useState(false);
  const { toast } = useToast();
  
  // Load projects on mount and when projects change
  useEffect(() => {
    loadProjects();
    
    const handleProjectChanged = () => {
      console.log("Project changed event detected in useProjectManagement");
      loadProjects();
    };
    
    window.addEventListener('projectChanged', handleProjectChanged);
    
    return () => {
      window.removeEventListener('projectChanged', handleProjectChanged);
    };
  }, []);
  
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const loadedProjects = await getProjectsFromLocalStorage();
      console.log("Loaded projects in useProjectManagement:", loadedProjects.length);
      setProjects(loadedProjects);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleCreateProject = async (name: string, description?: string) => {
    try {
      const newProject = await createProject(name, description);
      console.log("New project created:", newProject.name);
      
      // Force immediate reload of projects after creation
      await loadProjects();
      
      toast({
        title: "Project created",
        description: `${name} has been created successfully`,
      });
      
      return newProject;
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error creating project",
        description: "There was a problem creating your project",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const setProjectFromId = useCallback(async (projectId: string, currentProjectId: string) => {
    // Skip if we've already processed this project ID
    if (currentProjectId === projectId && hasProcessedProjectId) {
      return;
    }

    try {
      console.log("Setting project from ID:", projectId);
      
      // Make sure projects are loaded
      if (projects.length === 0) {
        await loadProjects();
      }
      
      // First check if project exists in local state
      let project = projects.find(p => p.id === projectId);
      
      // If not found in local state, fetch from database
      if (!project) {
        project = await getProjectById(projectId);
      }
      
      if (project) {
        console.log("Found project for ID:", project.name);
        // Mark project as selected to skip the project selection step
        setProjectSelected(true);
        setHasProcessedProjectId(true);
        
        toast({
          title: "Project selected",
          description: `${project.name} has been selected`
        });
        
        return project.id;
      } else {
        console.error("Project not found with ID:", projectId);
        toast({
          title: "Project not found",
          description: "Could not find the selected project",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error("Error setting project from ID:", error);
      toast({
        title: "Error selecting project",
        description: "There was a problem selecting the project",
        variant: "destructive"
      });
      return null;
    }
  }, [projects, hasProcessedProjectId, loadProjects, toast]);
  
  return {
    projects,
    isLoading,
    projectSelected,
    loadProjects,
    handleCreateProject,
    setProjectFromId,
    setProjectSelected
  };
};
