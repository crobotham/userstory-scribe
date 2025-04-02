
import React from "react";
import { UserStory, Project } from "@/utils/story";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import EditStoryFormFields from "./story/EditStoryFormFields";
import { useEditStoryForm } from "@/hooks/useEditStoryForm";
import { Loader2 } from "lucide-react";

interface EditStoryModalProps {
  story: UserStory | null;
  isOpen: boolean;
  onClose: () => void;
  onStoryUpdated: () => void;
  projects: Project[];
}

const EditStoryModal: React.FC<EditStoryModalProps> = ({ 
  story, 
  isOpen, 
  onClose,
  onStoryUpdated,
  projects
}) => {
  const {
    editedStory,
    isSubmitting,
    error,
    handleInputChange,
    handleAcceptanceCriteriaChange,
    handleProjectChange,
    handleSave
  } = useEditStoryForm(story, projects, onStoryUpdated, onClose);
  
  if (!editedStory) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User Story</DialogTitle>
        </DialogHeader>
        
        <EditStoryFormFields
          editedStory={editedStory}
          projects={projects}
          onInputChange={handleInputChange}
          onAcceptanceCriteriaChange={handleAcceptanceCriteriaChange}
          onProjectChange={handleProjectChange}
        />
        
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStoryModal;
