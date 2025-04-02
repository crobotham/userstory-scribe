import React from "react";
import { useToast } from "@/hooks/use-toast";
import { deleteStoryFromLocalStorage } from "@/utils/story/services/storyDelete";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog";

interface DeleteStoryHandlerProps {
  storyToDelete: string | null;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (value: boolean) => void;
  setStoryToDelete: (id: string | null) => void;
  setIsDetailViewOpen: (value: boolean) => void;
  onStoryUpdated: () => void;
}

const DeleteStoryHandler: React.FC<DeleteStoryHandlerProps> = ({
  storyToDelete,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  setStoryToDelete,
  setIsDetailViewOpen,
  onStoryUpdated,
}) => {
  const { toast } = useToast();

  const confirmDelete = async () => {
    if (!storyToDelete) return;
    
    try {
      await deleteStoryFromLocalStorage(storyToDelete);
      
      // First update the detail view state
      setIsDetailViewOpen(false);
      
      // Then update dialog states
      setIsDeleteDialogOpen(false);
      setStoryToDelete(null);
      
      // Notify parent components about the update
      onStoryUpdated();
      
      toast({
        title: "Story deleted",
        description: "Your user story has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting story:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting your story.",
        variant: "destructive",
      });
      
      // Make sure to clean up dialog state even on error
      setIsDeleteDialogOpen(false);
      setStoryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    console.log("Cancel delete operation");
    // Important: Keep order to avoid state conflicts
    setIsDeleteDialogOpen(false);
    setStoryToDelete(null);
    
    // Do NOT close detail view when canceling deletion
    // This detail view will be handled by the parent component
  };

  return (
    <DeleteConfirmationDialog
      isOpen={isDeleteDialogOpen}
      onOpenChange={(open) => {
        console.log("Delete dialog open state changing to:", open);
        if (!open) {
          handleCancelDelete();
        }
      }}
      onConfirmDelete={confirmDelete}
      itemType="story"
    />
  );
};

export default DeleteStoryHandler;
