
import React from "react";
import { formatDistanceToNow } from "date-fns";

interface BlogPostFooterProps {
  createdAt: string;
  author: string;
}

const BlogPostFooter: React.FC<BlogPostFooterProps> = ({ createdAt, author }) => {
  return (
    <div className="text-sm text-gray-500">
      {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
      <span className="mx-1">•</span>
      <span>{author}</span>
    </div>
  );
};

export default BlogPostFooter;
