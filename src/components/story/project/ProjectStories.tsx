
import React from "react";
import { Project, UserStory } from "@/utils/story";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StoryCard from "../StoryCard";
import { Loader2 } from "lucide-react";

interface ProjectStoriesProps {
  project: Project;
  stories: UserStory[];
  isLoading: boolean;
  onBackClick: () => void;
}

const ProjectStories: React.FC<ProjectStoriesProps> = ({
  project,
  stories,
  isLoading,
  onBackClick
}) => {
  const navigate = useNavigate();

  const handleCreateStory = () => {
    navigate(`/dashboard?projectId=${project.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBackClick}
            className="rounded-full"
          >
            <ChevronLeft size={16} />
          </Button>
          <h2 className="text-2xl font-semibold tracking-tight">{project.name}</h2>
        </div>
        <Button 
          onClick={handleCreateStory}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Create New Story</span>
        </Button>
      </div>

      {project.description && (
        <p className="text-muted-foreground">{project.description}</p>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading stories...</span>
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-background">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">No Stories Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            This project doesn't have any user stories yet. Create your first story to get started.
          </p>
          <Button onClick={handleCreateStory}>
            Create New Story
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectStories;
