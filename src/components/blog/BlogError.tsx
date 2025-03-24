
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import FooterSection from "@/components/home/FooterSection";

interface BlogErrorProps {
  error: string;
}

const BlogError: React.FC<BlogErrorProps> = ({ error }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Blog</h2>
          <p className="mb-4 text-gray-700">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default BlogError;
