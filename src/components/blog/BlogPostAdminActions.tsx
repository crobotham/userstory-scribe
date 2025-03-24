
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DeleteBlogPostDialog from "./DeleteBlogPostDialog";

interface BlogPostAdminActionsProps {
  postId: string;
  postTitle?: string;
}

const BlogPostAdminActions: React.FC<BlogPostAdminActionsProps> = ({ postId, postTitle }) => {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      
      // Reload the page to refresh the blog list
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <Button 
          variant="outline" 
          size="sm" 
          asChild
          className="h-8 w-8 p-0"
        >
          <Link to={`/blog/edit/${postId}`}>
            <span className="sr-only">Edit</span>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 w-8 p-0"
          onClick={handleDeleteClick}
        >
          <span className="sr-only">Delete</span>
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <DeleteBlogPostDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={handleDelete}
        postTitle={postTitle}
      />
    </>
  );
};

export default BlogPostAdminActions;
