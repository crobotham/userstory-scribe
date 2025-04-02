
import React from "react";
import { UserStory } from "@/utils/story";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileEdit, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoryCardProps {
  story: UserStory;
  onClick: (story: UserStory) => void;
  onEdit: (story: UserStory) => void;
  onDelete?: (storyId: string) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onClick,
  onEdit,
  onDelete,
}) => {
  // Format date to a readable format
  const formattedDate = new Date(story.createdAt).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  // Handle priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };
  
  // Ensure acceptance criteria is an array
  const acceptanceCriteria = story.acceptanceCriteria && Array.isArray(story.acceptanceCriteria) 
    ? story.acceptanceCriteria 
    : [];
  
  const acceptanceCriteriaCount = acceptanceCriteria.length;
  
  // Truncate text if it's too long
  const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card 
      className="relative h-full cursor-pointer hover:shadow-md transition-shadow"
      onClick={(e) => {
        e.preventDefault();
        onClick(story);
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium mr-10">
            {truncate(story.storyText, 120)}
          </CardTitle>
          
          <div className="absolute top-2 right-2 flex gap-1">
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(story.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(story);
              }}
            >
              <FileEdit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge variant="outline" className={`text-xs font-normal ${getPriorityColor(story.priority)}`}>
            {story.priority || 'Medium'}
          </Badge>
          
          {story.projectName && (
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs font-normal">
              {story.projectName}
            </Badge>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground mb-3">
          <span>{formattedDate}</span>
        </div>
        
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          {acceptanceCriteriaCount > 0 ? (
            <div className="flex items-center gap-1 text-green-500">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{acceptanceCriteriaCount} acceptance criteria</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-amber-500">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>No acceptance criteria</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StoryCard;
