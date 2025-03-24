
import React from "react";
import { Button } from "@/components/ui/button";
import { UserStory } from "@/utils/story";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Copy } from "lucide-react";

interface ResultsViewProps {
  story: UserStory;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ story, onReset }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDone = () => {
    // Navigate to Story Management page with the project selected
    navigate(`/stories?projectId=${story.projectId}`);
  };

  const handleCopyToClipboard = () => {
    // Format the user story for clipboard
    const formattedStory = `User Story: ${story.storyText}

Priority: ${story.priority}

${story.acceptanceCriteria.length > 0 ? `Acceptance Criteria:
${story.acceptanceCriteria.map(criteria => `- ${criteria}`).join('\n')}` : ''}

${story.additionalNotes ? `Additional Notes:
${story.additionalNotes}` : ''}`;

    navigator.clipboard.writeText(formattedStory).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "Your user story has been copied to the clipboard"
        });
      },
      () => {
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard. Please try again.",
          variant: "destructive"
        });
      }
    );
  };

  return (
    <div className="mb-10 animate-fade-in">
      <h3 className="text-xl font-semibold mb-6 text-center">
        Your User Story Is Ready!
      </h3>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">User Story</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleCopyToClipboard} 
                title="Copy to clipboard"
              >
                <Copy size={16} />
              </Button>
            </div>
            <Badge variant="outline">{story.priority} Priority</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium text-lg">{story.storyText}</p>

          {story.acceptanceCriteria.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Acceptance Criteria:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {story.acceptanceCriteria.map((criteria, index) => (
                  <li key={index}>{criteria}</li>
                ))}
              </ul>
            </div>
          )}

          {story.additionalNotes && (
            <div>
              <h4 className="font-semibold mb-2">Additional Notes:</h4>
              <p className="text-muted-foreground">{story.additionalNotes}</p>
            </div>
          )}

          {story.projectName && (
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">
                Project: {story.projectName}
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2 mt-4">
          <Button
            onClick={handleDone}
            variant="outline"
            className="mr-auto"
          >
            DONE
          </Button>
          <Button 
            onClick={onReset}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Create Another Story
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResultsView;
