
import React from "react";
import { UserStory } from "@/utils/story";
import StoryCard from "../StoryCard";

interface StoriesGridProps {
  stories: UserStory[];
  onEdit: (story: UserStory) => void;
  onView: (story: UserStory) => void;
  onDelete: (storyId: string) => void;
}

const StoriesGrid: React.FC<StoriesGridProps> = ({ stories, onEdit, onView, onDelete }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          story={story}
          // Change the main onClick to use onEdit instead of onView
          onClick={onEdit}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default StoriesGrid;

