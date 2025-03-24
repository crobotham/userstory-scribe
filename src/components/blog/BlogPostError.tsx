
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BlogPostErrorProps {
  error: string;
}

const BlogPostError = ({ error }: BlogPostErrorProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold mb-4">Could not load blog post</h2>
      <p className="text-gray-500 mb-8">
        {error}
      </p>
      <Button onClick={() => navigate('/blog')}>
        Return to Blog
      </Button>
    </div>
  );
};

export default BlogPostError;
