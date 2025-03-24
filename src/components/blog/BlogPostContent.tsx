
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Trash } from "lucide-react";
import { BlogPost } from "@/components/blog/BlogPostTypes";
import DeleteBlogPostDialog from "./DeleteBlogPostDialog";

interface BlogPostContentProps {
  post: BlogPost;
  isAdmin: boolean;
  onDelete: () => Promise<void>;
}

const BlogPostContent = ({ post, isAdmin, onDelete }: BlogPostContentProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    await onDelete();
    navigate('/blog');
  };

  return (
    <article>
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex gap-2 mb-4">
            <Badge variant="outline">
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </Badge>
            {post.is_popular && (
              <Badge variant="secondary">
                Popular
              </Badge>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {post.title}
          </h1>
        </div>
        
        {isAdmin && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
            >
              <Link to={`/blog/edit/${post.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDeleteClick}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Calendar className="h-4 w-4" />
        <time dateTime={post.created_at}>
          {format(new Date(post.created_at), 'MMMM d, yyyy')}
        </time>
        <span className="mx-1">•</span>
        <span>{post.author}</span>
      </div>
      
      {post.image_url && (
        <div className="mb-8">
          <img 
            src={post.image_url} 
            alt={post.title} 
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
      
      <div className="prose max-w-none">
        {post.content.split('\n').map((paragraph, idx) => (
          <p key={idx} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>

      <DeleteBlogPostDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={handleConfirmDelete}
        postTitle={post.title}
      />
    </article>
  );
};

export default BlogPostContent;
