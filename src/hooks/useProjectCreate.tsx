
import { useState } from "react";
import { Project, createProject } from "@/utils/story";
import { useToast } from "@/hooks/use-toast";

export const useProjectCreate = (onSuccess: () => Promise<void> | void) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleCreateProject = async (name: string, description?: string) => {
    try {
      const newProject = await createProject(name, description);
      await onSuccess();
      setIsCreateDialogOpen(false);
      
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
    }
  };
  
  return {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    handleCreateProject
  };
};
