
import { useState } from "react";
import { Project, createProject } from "@/utils/story";
import { useToast } from "@/hooks/use-toast";

export const useProjectCreate = (onSuccess: () => Promise<void> | void) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const { toast } = useToast();
  
  const handleCreateProject = async (name: string, description?: string) => {
    if (isCreatingProject) return;
    
    setIsCreatingProject(true);
    
    try {
      console.log("Creating project:", name);
      const newProject = await createProject(name, description);
      
      // Close dialog before showing toast and triggering callback
      setIsCreateDialogOpen(false);
      
      // Then trigger success callback and show toast
      await onSuccess();
      
      toast({
        title: "Project created",
        description: `Project "${name}" has been created successfully.`,
      });
      
      return newProject;
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error creating project",
        description: "There was a problem creating your project.",
        variant: "destructive",
      });
      throw error; // Re-throw to allow handling in the form
    } finally {
      setIsCreatingProject(false);
    }
  };
  
  return {
    isCreateDialogOpen,
    isCreatingProject,
    setIsCreateDialogOpen,
    handleCreateProject
  };
};
