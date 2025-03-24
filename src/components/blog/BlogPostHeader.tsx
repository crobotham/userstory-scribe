
import React from "react";
import { Badge } from "@/components/ui/badge";

interface BlogPostHeaderProps {
  title: string;
  category: string;
  isPopular: boolean;
}

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({ 
  title, 
  category, 
  isPopular 
}) => {
  return (
    <>
      <div className="flex justify-between items-start">
        <div>
          <Badge variant="outline" className="mb-2">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
          {isPopular && (
            <Badge variant="secondary" className="ml-2 mb-2">
              Popular
            </Badge>
          )}
        </div>
      </div>
      <h3 className="text-xl font-semibold leading-tight">{title}</h3>
    </>
  );
};

export default BlogPostHeader;
