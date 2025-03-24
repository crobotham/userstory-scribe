
import React from "react";
import { Loader2 } from "lucide-react";

const BlogFormLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-2 text-gray-500">Loading post data...</p>
      <p className="mt-1 text-sm text-gray-400">
        Please wait while we verify your permissions
      </p>
    </div>
  );
};

export default BlogFormLoading;
