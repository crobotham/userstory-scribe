
import React from "react";
import { Button } from "@/components/ui/button";
import { FileEdit, Trash } from "lucide-react";
import { UserStory } from "@/utils/story";

interface StoryDetailActionsProps {
  story: UserStory;
  onBack: () => void;
  onEdit: (story: UserStory) => void;
  onDelete: (storyId: string) => void;
}

const StoryDetailActions: React.FC<StoryDetailActionsProps> = ({
  story,
  onBack,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onBack}
        className="flex items-center gap-1"
      >
        Back
      </Button>
      
      <div className="flex-1" />
      
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDelete(story.id)}
        className="flex items-center gap-1 mr-2"
      >
        <Trash className="h-4 w-4" />
        Delete
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(story)}
        className="flex items-center gap-1"
      >
        <FileEdit className="h-4 w-4" />
        Edit
      </Button>
    </div>
  );
};

export default StoryDetailActions;
