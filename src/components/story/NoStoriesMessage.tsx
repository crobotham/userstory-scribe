
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkle, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NoStoriesMessage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateStory = () => {
    // Navigate to the dashboard to create a story
    navigate("/dashboard");
  };

  return (
    <div className="text-center p-8 space-y-6 bg-slate-50 rounded-lg border border-slate-100">
      <div className="relative inline-block">
        <BookOpen size={48} className="text-primary/20" />
        <Sparkle size={24} className="text-primary absolute -top-2 -right-2 animate-pulse" />
      </div>
      
      <h3 className="text-2xl font-bold mb-2">No User Stories Yet</h3>
      
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        User stories help capture requirements from an end user perspective. 
        Start creating your first story to better understand your users' needs!
      </p>
      
      <div className="flex justify-center">
        <Button 
          onClick={handleCreateStory}
          className="flex items-center gap-2 px-6 py-6 h-auto text-base group"
          size="lg"
        >
          <Sparkle size={20} />
          Create Your First Stories
          <ArrowRight size={18} className="ml-1 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};

export default NoStoriesMessage;
