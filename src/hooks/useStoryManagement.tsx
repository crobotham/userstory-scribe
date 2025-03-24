
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useStoryOperations } from "./story/useStoryOperations";
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
  
  // Initialize story operations
  const {
    stories,
    storyToEdit,
    storyToDelete,
    isEditModalOpen,
    isDeleteDialogOpen,
    setIsEditModalOpen,
    setIsDeleteDialogOpen,
    loadStories: loadStoriesBase,
    handleEditClick,
    handleDeleteClick,
    confirmDelete
  } = useStoryOperations(setIsLoading, isLoadingRef);
  
  // Wrap loadStories to include selectedProject
  const loadStories = async () => {
    console.log("useStoryManagement - Loading stories with project:", selectedProject);
    try {
      // Make sure we mark loading state
      setIsLoading(true);
      await loadStoriesBase(selectedProject);
    } catch (error) {
      console.error("Error in loadStories wrapper:", error);
      setIsLoading(false);
    }
  };
  
  // Setup event listeners
  useStoryEventListeners({
    loadProjects,
    loadStories,
    initialDataLoaded,
    user
  });
  
  // Effect to reload stories when selectedProject changes
  useEffect(() => {
    console.log("Selected project changed or component mounted:", selectedProject);
    // Only load stories if we have a user
    if (user && !isLoadingRef.current) {
      // Force immediate load of stories when selectedProject changes
      loadStories();
    }
  }, [selectedProject, user]);
  
  // Effect to ensure stories are loaded when component mounts
  useEffect(() => {
    if (user && !initialDataLoaded.current) {
      console.log("Initial loading of stories in useStoryManagement");
      initialDataLoaded.current = true;
      
      // Allow more time for initial data load
      setTimeout(() => {
        loadStories();
      }, 500);
    }
  }, [user]);
  
  return {
    stories,
    projects,
    storyToEdit,
    storyToDelete,
    isEditModalOpen,
    isDeleteDialogOpen,
    selectedProject,
    isLoading,
    setSelectedProject,
    setIsEditModalOpen,
    setIsDeleteDialogOpen,
    loadStories,
    loadProjects,
    handleEditClick,
    handleDeleteClick,
    confirmDelete
  };
};
