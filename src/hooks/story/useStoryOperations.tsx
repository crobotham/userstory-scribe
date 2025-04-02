
import { useState, useCallback } from "react";
import { 
  UserStory,
  getStoriesFromLocalStorage, 
  getStoriesByProject,
  deleteStoryFromLocalStorage
} from "@/utils/story";
import { useToast } from "@/contexts/ToastContext";

export const useStoryOperations = (
  setIsLoading: (value: boolean) => void,
  isLoadingRef: React.MutableRefObject<boolean>
) => {
  const [stories, setStories] = useState<UserStory[]>([]);
  const [storyToEdit, setStoryToEdit] = useState<UserStory | null>(null);
  const [storyToDelete, setStoryToDelete] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const loadStories = useCallback(async (selectedProject: string | null = null) => {
    console.log("useStoryOperations - loadStories called with project:", selectedProject);
    
    // If already loading, don't start another loading process
    if (isLoadingRef.current) {
      console.log("Already loading stories, skipping duplicate call");
      return;
    }
    
    // Set loading state
    setIsLoading(true);
    isLoadingRef.current = true;
    
    try {
      let loadedStories: UserStory[];
      
      // Clear previous stories first to prevent incorrect display during loading
      setStories([]);
      
      if (selectedProject) {
        // Load stories for the selected project
        console.log("Loading stories for specific project:", selectedProject);
        loadedStories = await getStoriesByProject(selectedProject);
      } else {
        // Load all stories (for "All Stories" selection)
        console.log("Loading all stories (null project)");
        loadedStories = await getStoriesFromLocalStorage();
      }
      
      // Sort by created date (newest first)
      loadedStories.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      console.log("Stories loaded successfully:", loadedStories.length);
      setStories(loadedStories);
    } catch (error) {
      console.error("Error loading stories:", error);
      setStories([]); // Reset stories on error to avoid showing stale data
      toast({
        title: "Error loading stories",
        description: "There was an error loading your stories.",
        variant: "destructive",
      });
    } finally {
      // Reduced delay to improve perceived performance
      setTimeout(() => {
        setIsLoading(false);
        isLoadingRef.current = false;
        console.log("Story loading complete, loading state cleared");
      }, 300); // Reduced from 1000ms to 300ms for better user experience
    }
  }, [setIsLoading, isLoadingRef, toast]);

  const handleEditClick = useCallback((story: UserStory) => {
    setStoryToEdit(story);
    setIsEditModalOpen(true);
  }, []);
  
  const handleDeleteClick = useCallback((storyId: string) => {
    setStoryToDelete(storyId);
    setIsDeleteDialogOpen(true);
  }, []);
  
  const confirmDelete = useCallback(async () => {
    if (!storyToDelete) return;
    
    try {
      await deleteStoryFromLocalStorage(storyToDelete);
      loadStories(); // Reload stories
      toast({
        title: "Story deleted",
        description: "Your user story has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "There was an error deleting your story.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setStoryToDelete(null);
    }
  }, [storyToDelete, loadStories, toast]);

  return {
    stories,
    storyToEdit,
    storyToDelete,
    isEditModalOpen,
    isDeleteDialogOpen,
    setIsEditModalOpen,
    setIsDeleteDialogOpen,
    loadStories,
    handleEditClick,
    handleDeleteClick,
    confirmDelete
  };
};
