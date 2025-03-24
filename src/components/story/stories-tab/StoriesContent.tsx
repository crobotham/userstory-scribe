
import React from "react";
import { UserStory, Project } from "@/utils/story";
import CreateProjectPrompt from "../CreateProjectPrompt";
import NoStoriesMessage from "../NoStoriesMessage";
import StoriesGrid from "./StoriesGrid";
import { Loader2 } from "lucide-react";

interface StoriesContentProps {
  projects: Project[];
  stories: UserStory[];
  isLoading?: boolean;
  onEditClick: (story: UserStory) => void;
  onDeleteClick: (storyId: string) => void;
  onCreateProject: (name: string, description?: string) => Promise<any>;
}

const StoriesContent: React.FC<StoriesContentProps> = ({
  projects,
  stories,
  isLoading = false,
  onEditClick,
  onDeleteClick,
  onCreateProject
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mt-2 text-muted-foreground">Loading stories...</span>
      </div>
    );
  }

  if (projects.length === 0) {
    return <CreateProjectPrompt onCreateProject={onCreateProject} />;
  }
  
  if (stories.length === 0) {
    return <NoStoriesMessage />;
  }
  
  return (
    <StoriesGrid 
      stories={stories} 
      onEditClick={onEditClick} 
      onDeleteClick={onDeleteClick} 
    />
  );
};

export default StoriesContent;
