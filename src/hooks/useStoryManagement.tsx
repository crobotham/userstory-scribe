
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProjectOperations } from "./story/useProjectOperations";
import { useStoryEventListeners } from "./story/useEventListeners";

export const useStoryManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isLoadingRef = useRef(false);
  const initialDataLoaded = useRef(false);
  const { user } = useAuth();
  
  // Initialize project operations first
  const {
    projects,
    selectedProject,
    setSelectedProject,
    loadProjects
  } = useProjectOperations(setIsLoading, isLoadingRef);
  
  // Setup event listeners
  useStoryEventListeners({
    loadProjects,
    loadStories: () => {}, // Empty function as stories are no longer used
    initialDataLoaded,
    user
  });
  
  // Effect to ensure projects are loaded when component mounts
  useEffect(() => {
    if (user && !initialDataLoaded.current) {
      console.log("Initial loading of projects in useStoryManagement");
      initialDataLoaded.current = true;
      
      // Allow more time for initial data load
      setTimeout(() => {
        loadProjects();
      }, 500);
    }
  }, [user, loadProjects]);
  
  return {
    projects,
    selectedProject,
    isLoading,
    setSelectedProject,
    loadProjects
  };
};
