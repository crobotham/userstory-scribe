
import React from "react";
import { UserStory } from "@/utils/story";
import StoryCard from "../StoryCard";
import { motion } from "framer-motion";

interface StoriesGridProps {
  stories: UserStory[];
  onEditClick: (story: UserStory) => void;
  onDeleteClick: (storyId: string) => void;
}

const StoriesGrid: React.FC<StoriesGridProps> = ({
  stories,
  onEditClick,
  onDeleteClick
}) => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid gap-6 md:grid-cols-2"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {stories.map((story) => (
        <motion.div key={story.id} variants={item}>
          <StoryCard
            story={story}
            onClick={onEditClick}
            onEdit={onEditClick}
            onDelete={onDeleteClick}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StoriesGrid;
