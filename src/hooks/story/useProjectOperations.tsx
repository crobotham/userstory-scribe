
import { useState, useCallback, useEffect } from "react";
import { 
  Project,
  getProjectsFromLocalStorage
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
      // Reduced timeout for faster loading
      setTimeout(() => {
        setIsLoading(false);
        isLoadingRef.current = false;
      }, 200); // Reduced from default timeout to improve performance
    }
  }, [setIsLoading, isLoadingRef, toast]);
  
  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    selectedProject,
    setSelectedProject,
    loadProjects
  };
};
