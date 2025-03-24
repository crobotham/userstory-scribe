
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Project } from "@/utils/story";
import AddStoryButton from "./AddStoryButton";

interface StoryHistoryHeaderProps {
  onExport: () => void;
  selectedProject: Project | null;
}

const StoryHistoryHeader: React.FC<StoryHistoryHeaderProps> = ({ 
  onExport, 
  selectedProject 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h3 className="text-lg font-semibold">
          {selectedProject ? `Stories for ${selectedProject.name}` : "All Stories"}
        </h3>
        {selectedProject && selectedProject.description && (
          <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
        )}
      </div>
      <div className="flex space-x-2">
        <AddStoryButton selectedProject={selectedProject} />
        <Button 
          variant="outline" 
          onClick={onExport}
          className="flex items-center gap-1"
        >
          <Download size={16} />
          <span>Export</span>
        </Button>
      </div>
    </div>
  );
};

export default StoryHistoryHeader;
