
import React from "react";
import { UserStory } from "@/utils/story";
import StoryDetailActions from "./StoryDetailActions";
import StoryContentDisplay from "./StoryContentDisplay";

interface StoryDetailContentProps {
  story: UserStory;
  onBack: () => void;
  onEdit: (story: UserStory) => void;
  onDelete: (storyId: string) => void;
}

const StoryDetailContent: React.FC<StoryDetailContentProps> = ({ 
  story, 
  onBack, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="space-y-6">
      <StoryDetailActions 
        story={story} 
        onBack={onBack} 
        onEdit={onEdit} 
        onDelete={onDelete} 
      />
      
      <StoryContentDisplay story={story} />
    </div>
  );
};

export default StoryDetailContent;
