
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
  };

  const handleProjectChange = (projectId: string) => {
    // Find the project name from the project id
    let projectName: string | undefined;
    
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      projectName = project?.name;
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
    
    // Validate that a project is selected
    if (!editedStory.projectId && projects.length > 0) {
      setError("Please select a project");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateStoryInLocalStorage(editedStory);
      toast({
        title: "Story updated",
        description: "Your user story has been updated successfully.",
      });
      onStoryUpdated();
      onClose();
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your story.",
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
