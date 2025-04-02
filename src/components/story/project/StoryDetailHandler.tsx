
import React from "react";
import { UserStory } from "@/utils/story";
import StoryDetailView from "../StoryDetailView";

interface StoryDetailHandlerProps {
  selectedStory: UserStory | null;
  isDetailViewOpen: boolean;
  setIsDetailViewOpen: (value: boolean) => void;
  setSelectedStory: (story: UserStory | null) => void;
  onEdit: (story: UserStory) => void;
  onDelete: (storyId: string) => void;
}

const StoryDetailHandler: React.FC<StoryDetailHandlerProps> = ({
  selectedStory,
  isDetailViewOpen,
  setIsDetailViewOpen,
  setSelectedStory,
  onEdit,
  onDelete,
}) => {
  const handleCloseDetailView = () => {
    setIsDetailViewOpen(false);
    setSelectedStory(null);
  };

  return (
    <StoryDetailView 
      story={selectedStory}
      isOpen={isDetailViewOpen}
      onClose={handleCloseDetailView}
      onEdit={onEdit}
      onBack={handleCloseDetailView}
      onDelete={onDelete}
    />
  );
};

export default StoryDetailHandler;
