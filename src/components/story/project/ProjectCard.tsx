
import React from "react";
import { Project } from "@/utils/story";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, FileText } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onSelect: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onSelect
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{project.name}</CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(project)}
              title="Edit project"
            >
              <Edit size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(project)}
              title="Delete project"
              className="text-destructive"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {project.description ? (
          <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
        ) : (
          <p className="text-muted-foreground text-sm italic mb-4">No description</p>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2"
          onClick={() => onSelect(project)}
        >
          <FileText size={16} />
          <span>View Stories</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
