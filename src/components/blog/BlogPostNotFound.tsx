
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BlogPostNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold mb-4">Blog post not found</h2>
      <p className="text-gray-500 mb-8">
        The blog post you're looking for doesn't exist or has been removed.
      </p>
      <Button onClick={() => navigate('/blog')}>
        Return to Blog
      </Button>
    </div>
  );
};

export default BlogPostNotFound;
