
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/utils/story";

interface EditProjectDialogProps {
  project: Project | null;
  onClose: () => void;
  onSave: (project: Project) => void;
}

const EditProjectDialog: React.FC<EditProjectDialogProps> = ({
  project,
  onClose,
  onSave,
}) => {
  if (!project) return null;

  const [editedProject, setEditedProject] = React.useState<Project>(project);

  return (
    <Dialog 
      open={!!project} 
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">
              Project Name
            </Label>
            <Input
              id="edit-name"
              value={editedProject.name}
              onChange={(e) => setEditedProject({
                ...editedProject,
                name: e.target.value
              })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="edit-description">
              Description
            </Label>
            <Textarea
              id="edit-description"
              value={editedProject.description || ""}
              onChange={(e) => setEditedProject({
                ...editedProject,
                description: e.target.value
              })}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={() => onSave(editedProject)}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
