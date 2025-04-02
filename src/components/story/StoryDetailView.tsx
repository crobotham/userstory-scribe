
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit, ArrowLeft } from "lucide-react";

interface StoryDetailViewProps {
  story: UserStory | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (story: UserStory) => void;
}

const StoryDetailView: React.FC<StoryDetailViewProps> = ({ 
  story, 
  isOpen, 
  onClose,
  onEdit
}) => {
  if (!story) return null;
  
  const priorityColors: Record<string, string> = {
    "High": "bg-red-100 text-red-800",
    "Medium": "bg-yellow-100 text-yellow-800",
    "Low": "bg-green-100 text-green-800"
  };
  
  // Log the story data including acceptance criteria
  console.log("Rendering StoryDetailView with story:", story);
  console.log("Acceptance criteria:", story.acceptanceCriteria);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>User Story Details</span>
            <Badge className={priorityColors[story.priority] || "bg-blue-100 text-blue-800"}>
              {story.priority} Priority
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {story.projectName && (
            <div>
              <h4 className="text-sm font-medium mb-1">Project:</h4>
              <p className="text-sm">{story.projectName}</p>
            </div>
          )}
          
          <div>
            <h4 className="text-sm font-medium mb-1">User Story:</h4>
            <p className="text-base">{story.storyText}</p>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Role:</h4>
              <p className="text-sm">{story.role}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Goal:</h4>
              <p className="text-sm">{story.goal}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Benefit:</h4>
              <p className="text-sm">{story.benefit}</p>
            </div>
          </div>
          
          {story.acceptanceCriteria && story.acceptanceCriteria.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Acceptance Criteria:</h4>
              <ul className="text-sm list-disc list-inside">
                {story.acceptanceCriteria.map((criteria, index) => (
                  <li key={index}>{criteria}</li>
                ))}
              </ul>
            </div>
          )}
          
          {story.additionalNotes && (
            <div>
              <h4 className="text-sm font-medium mb-1">Additional Notes:</h4>
              <p className="text-sm">{story.additionalNotes}</p>
            </div>
          )}
          
          <div>
            <h4 className="text-sm font-medium mb-1">Created:</h4>
            <p className="text-sm">{new Date(story.createdAt).toLocaleString()}</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="gap-2">
            <ArrowLeft size={16} />
            <span>Back</span>
          </Button>
          <Button onClick={() => {
            onClose();
            onEdit(story);
          }} className="gap-2">
            <Edit size={16} />
            <span>Edit</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StoryDetailView;
