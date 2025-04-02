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
    } finally {
      setIsDeleteDialogOpen(false);
      setStoryToDelete(null);
      setIsDetailViewOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setStoryToDelete(null);
    // Keep detail view open if user cancels deletion
  };

  return (
    <DeleteConfirmationDialog
      isOpen={isDeleteDialogOpen}
      onOpenChange={(open) => {
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
