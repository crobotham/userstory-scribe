
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Bot, AlertCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import NewProjectDialog from "./story/NewProjectDialog";
import StoryGenerationForm from "./story/bulk-generator/StoryGenerationForm";
import { useBulkStoryGenerator } from "@/hooks/useBulkStoryGenerator";

interface BulkStoryGeneratorProps {
  onStoriesGenerated: () => void;
}

const BulkStoryGenerator: React.FC<BulkStoryGeneratorProps> = ({ onStoriesGenerated }) => {
  const {
    projectDescription,
    setProjectDescription,
    numberOfStories,
    setNumberOfStories,
    isGenerating,
    error,
    apiKey,
    selectedProjectId,
    setSelectedProjectId,
    projects,
    isNewProjectDialogOpen,
    setIsNewProjectDialogOpen,
    handleCreateProject,
    handleGenerateStories
  } = useBulkStoryGenerator(onStoriesGenerated);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Bulk Story Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <StoryGenerationForm
          projectDescription={projectDescription}
          setProjectDescription={setProjectDescription}
          numberOfStories={numberOfStories}
          setNumberOfStories={setNumberOfStories}
          selectedProjectId={selectedProjectId}
          setSelectedProjectId={setSelectedProjectId}
          projects={projects}
          setIsNewProjectDialogOpen={setIsNewProjectDialogOpen}
          isGenerating={isGenerating}
          error={error}
        />
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerateStories}
          disabled={isGenerating || !projectDescription.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Stories...
            </>
          ) : (
            "Generate User Stories"
          )}
        </Button>
      </CardFooter>

      <NewProjectDialog
        isOpen={isNewProjectDialogOpen}
        onClose={() => setIsNewProjectDialogOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </Card>
  );
};

export default BulkStoryGenerator;
