
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface EmptyStoriesViewProps {
  onCreateStory: () => void;
}

const EmptyStoriesView: React.FC<EmptyStoriesViewProps> = ({ onCreateStory }) => {
  return (
    <div className="text-center p-12 border rounded-lg bg-background">
      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-xl font-medium mb-2">No Stories Yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        This project doesn't have any user stories yet. Create your first story to get started.
      </p>
      <Button onClick={onCreateStory}>
        Create New Story
      </Button>
    </div>
  );
};

export default EmptyStoriesView;
