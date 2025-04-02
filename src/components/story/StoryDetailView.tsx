import React from "react";
import { UserStory } from "@/utils/story";
import { Button } from "@/components/ui/button";
import { FileEdit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface StoryDetailViewProps {
  story: UserStory | null;
  onBack: () => void;
  onEdit: (story: UserStory) => void;
  onDelete: (storyId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const StoryDetailView: React.FC<StoryDetailViewProps> = ({
  story,
  onBack,
  onEdit,
  onDelete,
  isOpen,
  onClose,
}) => {
  if (isOpen !== undefined && onClose && story) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <StoryDetailContent 
            story={story} 
            onBack={onClose} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        </DialogContent>
      </Dialog>
    );
  }

  if (!story) return null;
  
  return <StoryDetailContent story={story} onBack={onBack} onEdit={onEdit} onDelete={onDelete} />;
};

const StoryDetailContent: React.FC<{
  story: UserStory;
  onBack: () => void;
  onEdit: (story: UserStory) => void;
  onDelete: (storyId: string) => void;
}> = ({ story, onBack, onEdit, onDelete }) => {
  const formattedDate = new Date(story.createdAt).toLocaleString();
  
  const acceptanceCriteria = story.acceptanceCriteria && Array.isArray(story.acceptanceCriteria) 
    ? story.acceptanceCriteria 
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center gap-1"
        >
          Back
        </Button>
        
        <div className="flex-1" />
        
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(story.id)}
          className="flex items-center gap-1 mr-2"
        >
          <Trash className="h-4 w-4" />
          Delete
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(story)}
          className="flex items-center gap-1"
        >
          <FileEdit className="h-4 w-4" />
          Edit
        </Button>
      </div>
      
      <div className="bg-card rounded-lg border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-normal">
            {story.priority || 'Medium'}
          </Badge>
          
          {story.projectName && (
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs font-normal">
              {story.projectName}
            </Badge>
          )}
          
          <div className="flex-1" />
          
          <span className="text-xs text-muted-foreground">
            Created: {formattedDate}
          </span>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">
            {story.storyText}
          </h2>
          
          {story.additionalNotes && (
            <p className="text-muted-foreground text-sm">
              {story.additionalNotes}
            </p>
          )}
        </div>
        
        <div className="border-t pt-4 space-y-3">
          <div>
            <h3 className="text-sm font-medium mb-1">Role:</h3>
            <p>{story.role}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Goal:</h3>
            <p>{story.goal}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Benefit:</h3>
            <p>{story.benefit}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Acceptance Criteria:</h3>
            {acceptanceCriteria.length > 0 ? (
              <ScrollArea className="max-h-[200px]">
                <ul className="list-disc pl-5 space-y-1">
                  {acceptanceCriteria.map((criterion, index) => (
                    <li key={index}>{criterion}</li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <p className="text-muted-foreground text-sm">No acceptance criteria defined.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailView;
