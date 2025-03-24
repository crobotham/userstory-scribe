
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

interface BlogHeaderProps {
  isAdmin: boolean;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({ isAdmin }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-primary/5 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            SonicStories Blog
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Discover the latest updates, features, and stories from our team
          </p>
          
          {isAdmin && (
            <div className="mt-8">
              <Button 
                onClick={() => navigate('/blog/new')} 
                className="gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                New Blog Post
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;
