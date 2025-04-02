
import { useState } from "react";
import { Project, deleteProjectFromLocalStorage } from "@/utils/story";
import { useToast } from "@/hooks/use-toast";

export const useProjectDelete = (onSuccess: () => Promise<void> | void) => {
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    
    try {
      await deleteProjectFromLocalStorage(projectToDelete.id);
      await onSuccess();
      
      toast({
        title: "Project deleted",
        description: `Project "${projectToDelete.name}" has been permanently deleted.`,
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the project.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };
  
  return {
    projectToDelete,
    isDeleteDialogOpen,
    setProjectToDelete,
    setIsDeleteDialogOpen,
    handleDeleteProject
  };
};
