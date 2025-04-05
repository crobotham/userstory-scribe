
import { useState, useEffect } from "react";
import { UserStory, Project, updateStoryInLocalStorage } from "@/utils/story";
import { useToast } from "@/hooks/use-toast";

export const useEditStoryForm = (
  story: UserStory | null,
  projects: Project[],
  onStoryUpdated: () => void,
  onClose: () => void
) => {
  const { toast } = useToast();
  const [editedStory, setEditedStory] = useState<UserStory | null>(story);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reset form when a new story is loaded
  useEffect(() => {
    setEditedStory(story);
    setError(null);
  }, [story]);
  
  // If no projects exist, automatically select the first one
  useEffect(() => {
    if (projects.length > 0 && editedStory && !editedStory.projectId) {
      handleProjectChange(projects[0].id);
    }
  }, [projects, editedStory]);
  
  const handleInputChange = (field: keyof UserStory, value: string | string[]) => {
    setEditedStory(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
    
    // Clear any previous errors when user makes changes
    setError(null);
  };
  
  const handleAcceptanceCriteriaChange = (value: string) => {
    const criteria = value
      .split('\n')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    setEditedStory(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        acceptanceCriteria: criteria
      };
    });
    
    // Clear any previous errors when user makes changes
    setError(null);
  };

  const handleProjectChange = (projectId: string) => {
    // Find the project name from the project id
    let projectName: string | undefined;
    
    if (projectId && projectId !== 'no-project') {
      const project = projects.find(p => p.id === projectId);
      projectName = project?.name;
    } else {
      projectId = ''; // Set to empty string if "no-project"
    }
    
    setEditedStory(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        projectId: projectId,
        projectName: projectName
      };
    });
    
    setError(null);
  };
  
  const handleSave = async () => {
    if (!editedStory) return;
    
    // Basic validation
    if (!editedStory.role.trim()) {
      setError("Role is required");
      return;
    }
    
    if (!editedStory.goal.trim()) {
      setError("Goal is required");
      return;
    }
    
    if (!editedStory.benefit.trim()) {
      setError("Benefit is required");
      return;
    }
    
    // Validate that a project is selected if we have projects
    if (projects.length > 0 && !editedStory.projectId) {
      setError("Please select a project");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log("Saving story with ID:", editedStory.id);
      
      // Make sure the story text is correctly formed
      const storyText = `As a ${editedStory.role}, I want to ${editedStory.goal}, so that ${editedStory.benefit}.`;
      const storyToSave: UserStory = {
        ...editedStory,
        storyText
      };
      
      // Optimistically close the dialog and show toast to improve perceived performance
      onClose();
      
      toast({
        title: "Saving story...",
        description: "Your changes are being saved.",
      });
      
      // Save to Supabase
      await updateStoryInLocalStorage(storyToSave);
      
      // Notify parent components
      onStoryUpdated();
      
      // Success toast
      toast({
        title: "Story updated",
        description: "Your user story has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating story:", error);
      
      // Set a more specific error message
      let errorMessage = "Failed to update story. Please try again.";
      
      if (error instanceof Error) {
        // Only show user-friendly part of the error message
        const errorText = error.message;
        if (errorText.includes("Database update error:")) {
          errorMessage = errorText;
        }
      }
      
      // Show toast with error details
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    editedStory,
    isSubmitting,
    error,
    handleInputChange,
    handleAcceptanceCriteriaChange,
    handleProjectChange,
    handleSave
  };
};
