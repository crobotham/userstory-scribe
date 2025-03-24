
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface BlogFormActionsProps {
  isLoading: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

const BlogFormActions: React.FC<BlogFormActionsProps> = ({ 
  isLoading, 
  isEditing, 
  onCancel 
}) => {
  return (
    <div className="flex justify-end gap-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isLoading}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {isEditing ? 'Update Post' : 'Publish Post'}
      </Button>
    </div>
  );
};

export default BlogFormActions;
