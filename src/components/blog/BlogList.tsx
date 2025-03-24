import React from "react";
import BlogPostCard from "./BlogPostCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPost } from "./BlogPostTypes";

interface BlogListProps {
  posts: BlogPost[];
  isLoading: boolean;
  isAdmin: boolean;
  category: string;
}

const BlogList: React.FC<BlogListProps> = ({ posts, isLoading, isAdmin, category }) => {
  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-medium text-gray-900 mb-4">No blog posts found</h3>
        <p className="text-gray-500 mb-8">
          {category === "latest" 
            ? "There are no blog posts yet." 
            : `There are no ${category} blog posts yet.`}
        </p>
        {isAdmin && (
          <Button 
            onClick={() => window.location.href = '/blog/new'}
          >
            Create First Blog Post
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogPostCard 
          key={post.id} 
          post={post} 
          isAdmin={isAdmin} 
        />
      ))}
    </div>
  );
};

export default BlogList;
