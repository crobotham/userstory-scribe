
import { useState, useCallback, useEffect } from "react";
import { 
  Project,
  getProjectsFromLocalStorage,
  getProjectById
} from "@/utils/story";
import { useToast } from "@/contexts/ToastContext";

export const useProjectOperations = (
  setIsLoading: (value: boolean) => void,
  isLoadingRef: React.MutableRefObject<boolean>
) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { toast } = useToast();
  
  const loadProjects = useCallback(async () => {
    // Prevent concurrent loading
    if (isLoadingRef.current) {
      console.log("Already loading projects, skipping duplicate call");
      return;
    }
    
    console.log("Loading projects...");
    setIsLoading(true);
    isLoadingRef.current = true;
    
    try {
      const loadedProjects = await getProjectsFromLocalStorage();
      // Sort by created date (newest first)
      loadedProjects.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setProjects(loadedProjects);
      console.log("Projects loaded successfully:", loadedProjects.length);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast({
        title: "Error loading projects",
        description: "There was an error loading your projects.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [setIsLoading, isLoadingRef, toast]);
  
  // Helper method to set project from ID
  const setProjectFromId = useCallback(async (projectId: string) => {
    console.log("Setting project from ID:", projectId);
    
    // First check if we already have this project in our loaded projects
    const existingProject = projects.find(p => p.id === projectId);
    
    if (existingProject) {
      console.log("Found project in loaded projects:", existingProject.name);
      setSelectedProject(projectId);
    } else {
      // Try to fetch the project directly
      try {
        console.log("Fetching project details directly");
        const project = await getProjectById(projectId);
        
        if (project) {
          console.log("Found project:", project.name);
          setSelectedProject(projectId);
          // Ensure projects are reloaded to include this project
          loadProjects();
        } else {
          console.log("Project not found with ID:", projectId);
          toast({
            title: "Project not found",
            description: "The selected project could not be found.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error loading project",
          description: "There was an error loading the selected project.",
          variant: "destructive",
        });
      }
    }
  }, [projects, toast, loadProjects]);
  
  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    selectedProject,
    setSelectedProject,
    setProjectFromId,
    loadProjects
  };
};
