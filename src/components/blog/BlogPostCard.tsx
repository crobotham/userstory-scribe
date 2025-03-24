
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BlogPost } from "./BlogPostTypes";
import BlogPostImage from "./BlogPostImage";
import BlogPostHeader from "./BlogPostHeader";
import BlogPostFooter from "./BlogPostFooter";
import BlogPostAdminActions from "./BlogPostAdminActions";

interface BlogPostCardProps {
  post: BlogPost;
  isAdmin: boolean;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, isAdmin }) => {
  return (
    <Link to={`/blog/${post.id}`}>
      <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
        <BlogPostImage imageUrl={post.image_url} title={post.title} />
        
        <CardHeader className="pb-2">
          <BlogPostHeader 
            title={post.title} 
            category={post.category} 
            isPopular={!!post.is_popular} 
          />
        </CardHeader>
        
        <CardContent className="flex-grow">
          <p className="text-gray-500 text-sm line-clamp-3">{post.summary}</p>
        </CardContent>
        
        <CardFooter className="pt-2 border-t flex items-center justify-between">
          <BlogPostFooter createdAt={post.created_at} author={post.author} />
          
          {isAdmin && <BlogPostAdminActions postId={post.id} postTitle={post.title} />}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogPostCard;
