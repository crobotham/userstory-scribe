
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import ProjectSelector from "./ProjectSelector";
import { Project } from "@/utils/story";

interface StoryGenerationFormProps {
  projectDescription: string;
  setProjectDescription: (description: string) => void;
  numberOfStories: number;
  setNumberOfStories: (num: number) => void;
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  projects: Project[];
  setIsNewProjectDialogOpen: (isOpen: boolean) => void;
  isGenerating: boolean;
  error: string | null;
}

const StoryGenerationForm: React.FC<StoryGenerationFormProps> = ({
  projectDescription,
  setProjectDescription,
  numberOfStories,
  setNumberOfStories,
  selectedProjectId,
  setSelectedProjectId,
  projects,
  setIsNewProjectDialogOpen,
  isGenerating,
  error
}) => {
  // If no projects exist, show a create project prompt
  if (projects.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-background">
        <h3 className="text-xl font-medium mb-2">Create a Project First</h3>
        <p className="text-muted-foreground mb-4">
          You need to create a project before you can generate user stories.
        </p>
        <Button onClick={() => setIsNewProjectDialogOpen(true)}>
          Create Project
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <ProjectSelector 
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        projects={projects}
        setIsNewProjectDialogOpen={setIsNewProjectDialogOpen}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium">Project Description</label>
        <Textarea
          placeholder="Describe your project in detail to generate relevant user stories..."
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          className="min-h-[120px]"
          disabled={isGenerating}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="block text-sm font-medium">Number of Stories</label>
          <span className="text-sm font-medium">{numberOfStories}</span>
        </div>
        <Slider
          value={[numberOfStories]}
          onValueChange={(values) => setNumberOfStories(values[0])}
          min={1}
          max={10}
          step={1}
          disabled={isGenerating}
        />
        <p className="text-xs text-muted-foreground">
          Select between 1-10 stories to generate
        </p>
      </div>
    </>
  );
};

export default StoryGenerationForm;
