
import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
  itemName?: string;
  itemType?: 'story' | 'project';
  requireNameConfirmation?: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirmDelete,
  itemName = "",
  itemType = "story",
  requireNameConfirmation = false,
}) => {
  const [confirmationText, setConfirmationText] = useState("");
  const isDeleteDisabled = requireNameConfirmation && confirmationText !== itemName;
  
  // Reset the confirmation text when dialog opens or closes
  useEffect(() => {
    if (!isOpen) {
      setConfirmationText("");
    }
  }, [isOpen]);
  
  const handleConfirmDelete = () => {
    onConfirmDelete();
    setConfirmationText(""); // Reset the input field after confirmation
  };

  const handleCancel = () => {
    setConfirmationText(""); // Reset the input field when canceling
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              This action cannot be undone. This will permanently delete the {itemType}
              {itemName && ` "${itemName}"`} and all of its data.
            </p>
            
            {requireNameConfirmation && (
              <div className="pt-2">
                <Label htmlFor="confirm-name" className="font-medium text-destructive">
                  Please type "{itemName}" to confirm deletion
                </Label>
                <Input 
                  id="confirm-name"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder={`Type ${itemName} to confirm`}
                  className="mt-1 border-destructive"
                />
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirmDelete} 
            className="bg-destructive text-destructive-foreground"
            disabled={isDeleteDisabled}
          >
            Delete {itemType}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
