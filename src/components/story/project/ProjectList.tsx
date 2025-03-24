
import React from "react";
import { Project } from "@/utils/story";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectCard from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
  isLoading: boolean;
  onCreateNew: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  isLoading,
  onCreateNew,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading projects...</span>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-background">
        <h3 className="text-xl font-medium mb-2">No Projects Yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first project to organize your user stories.
        </p>
        <Button onClick={onCreateNew}>
          Create Project
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default ProjectList;
