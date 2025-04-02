
import React from "react";
import { UserStory } from "@/utils/story";
import StoryCard from "../StoryCard";

interface StoriesGridProps {
  stories: UserStory[];
  onEdit: (story: UserStory) => void;
  onView: (story: UserStory) => void;
}

const StoriesGrid: React.FC<StoriesGridProps> = ({ stories, onEdit, onView }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          story={story}
          onEdit={onEdit}
          onDelete={() => {}}
          onView={onView}
        />
      ))}
    </div>
  );
};

export default StoriesGrid;
