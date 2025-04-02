
import React from "react";
import { UserStory } from "@/utils/story";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import StoryDetailContent from "./StoryDetailContent";

interface StoryDetailViewProps {
  story: UserStory | null;
  onBack: () => void;
  onEdit: (story: UserStory) => void;
  onDelete: (storyId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const StoryDetailView: React.FC<StoryDetailViewProps> = ({
  story,
  onBack,
  onEdit,
  onDelete,
  isOpen,
  onClose,
}) => {
  if (isOpen !== undefined && onClose && story) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <StoryDetailContent 
            story={story} 
            onBack={onClose} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        </DialogContent>
      </Dialog>
    );
  }

  if (!story) return null;
  
  return <StoryDetailContent story={story} onBack={onBack} onEdit={onEdit} onDelete={onDelete} />;
};

export default StoryDetailView;
