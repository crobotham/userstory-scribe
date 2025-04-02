
import { useState } from "react";
import { Project, updateProjectInLocalStorage } from "@/utils/story";
import { useToast } from "@/hooks/use-toast";

export const useProjectUpdate = (onSuccess: () => Promise<void> | void) => {
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const { toast } = useToast();
  
  const handleUpdateProject = async (project: Project) => {
    try {
      await updateProjectInLocalStorage(project);
      await onSuccess();
      setProjectToEdit(null);
      
      toast({
        title: "Project updated",
        description: `Project "${project.name}" has been updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating the project.",
        variant: "destructive",
      });
    }
  };
  
  return {
    projectToEdit,
    setProjectToEdit,
    handleUpdateProject
  };
};
