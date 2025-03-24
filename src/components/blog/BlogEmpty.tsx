
import React from "react";
import { Button } from "@/components/ui/button";

interface BlogEmptyProps {
  isAdmin: boolean;
  onAddTestPost: () => void;
}

const BlogEmpty: React.FC<BlogEmptyProps> = ({ isAdmin, onAddTestPost }) => {
  return (
    <div className="my-8 text-center">
      <p className="text-lg text-gray-600 mb-4">
        No blog posts found in the database.
      </p>
      {isAdmin && (
        <Button
          onClick={onAddTestPost}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Test Blog Post
        </Button>
      )}
    </div>
  );
};

export default BlogEmpty;
