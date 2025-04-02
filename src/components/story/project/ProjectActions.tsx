
import React from "react";
import { Project } from "@/utils/story";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProjectActionsProps {
  onCreateNew: () => void;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({ onCreateNew }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold tracking-tight">Project Management</h2>
      <Button 
        onClick={onCreateNew}
        className="flex items-center gap-2"
      >
        <Plus size={16} />
        <span>Create New Project</span>
      </Button>
    </div>
  );
};

export default ProjectActions;
