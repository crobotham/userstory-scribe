
import React from "react";
import { UserStory } from "@/utils/story";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Copy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface StoryCardProps {
  story: UserStory;
  onEdit: (story: UserStory) => void;
  onDelete: (storyId: string) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onEdit, onDelete }) => {
  const { toast } = useToast();
  
  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };
  
  const formattedDate = formatDistanceToNow(new Date(story.createdAt), { 
    addSuffix: true 
  });
  
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
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-base">
            {truncate(story.storyText, 120)}
          </h3>
          <Badge className="whitespace-nowrap" variant="outline">
            {story.priority}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="py-2 flex-grow">
        {story.acceptanceCriteria.length > 0 && (
          <div className="mb-2">
            <h4 className="text-sm font-semibold mb-1">Acceptance Criteria:</h4>
            <ul className="text-sm text-muted-foreground list-disc ml-4">
              {story.acceptanceCriteria.slice(0, 2).map((criteria, index) => (
                <li key={index}>{truncate(criteria, 60)}</li>
              ))}
              {story.acceptanceCriteria.length > 2 && (
                <li className="text-muted-foreground">
                  +{story.acceptanceCriteria.length - 2} more
                </li>
              )}
            </ul>
          </div>
        )}
        
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto">
          <div>Created {formattedDate}</div>
          {story.projectName && (
            <div className="text-right">
              Project: {truncate(story.projectName, 15)}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyToClipboard}
          className="h-8 px-2"
          title="Copy story"
        >
          <Copy size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(story)}
          className="h-8 px-2"
          title="Edit story"
        >
          <Edit size={16} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(story.id)}
          className="h-8 px-2 text-destructive hover:text-destructive"
          title="Delete story"
        >
          <Trash2 size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StoryCard;
