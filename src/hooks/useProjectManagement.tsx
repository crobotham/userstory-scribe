
import { useState, useEffect, useCallback } from "react";
import { 
  Project,
  getProjectsFromLocalStorage,
  createProject
} from "@/utils/story";
import { useToast } from "@/contexts/ToastContext";

export const useProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Load projects on mount and when projects change
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const loadedProjects = await getProjectsFromLocalStorage();
      console.log("Loaded projects in useProjectManagement:", loadedProjects.length);
      // Sort by created date (newest first)
      loadedProjects.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setProjects(loadedProjects);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast({
        title: "Error loading projects",
        description: "There was a problem loading your projects",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
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
  }, [loadProjects]);
  
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
  
  return {
    projects,
    isLoading,
    loadProjects,
    handleCreateProject
  };
};
