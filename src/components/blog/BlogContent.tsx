
import React, { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlogList from "@/components/blog/BlogList";
import BlogEmpty from "@/components/blog/BlogEmpty";
import { BlogPost } from "@/components/blog/BlogPostTypes";

interface BlogContentProps {
  isLoading: boolean;
  blogPosts: BlogPost[];
  isAdmin: boolean;
  onAddTestPost: () => void;
}

const BlogContent: React.FC<BlogContentProps> = ({ 
  isLoading, 
  blogPosts, 
  isAdmin, 
  onAddTestPost 
}) => {
  const [activeTab, setActiveTab] = useState("latest");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <>
      {blogPosts.length === 0 ? (
        <BlogEmpty isAdmin={isAdmin} onAddTestPost={onAddTestPost} />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="latest">Latest</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>
          
          <TabsContent value="latest" className="mt-6">
            <BlogList 
              posts={blogPosts} 
              isLoading={false} 
              isAdmin={isAdmin} 
              category="latest" 
            />
          </TabsContent>
          
          <TabsContent value="popular" className="mt-6">
            <BlogList 
              posts={blogPosts.filter(post => post.is_popular)} 
              isLoading={false} 
              isAdmin={isAdmin} 
              category="popular" 
            />
          </TabsContent>
          
          <TabsContent value="features" className="mt-6">
            <BlogList 
              posts={blogPosts.filter(post => post.is_featured || post.category === 'feature')} 
              isLoading={false} 
              isAdmin={isAdmin} 
              category="features" 
            />
          </TabsContent>
        </Tabs>
      )}
    </>
  );
};

export default BlogContent;
