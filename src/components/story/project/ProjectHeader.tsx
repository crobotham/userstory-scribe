
import React from "react";
import { Project } from "@/utils/story";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Download, FileText, FileSpreadsheet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ProjectHeaderProps {
  project: Project;
  storiesExist: boolean;
  onBackClick: () => void;
  onCreateStory: () => void;
  onExportToPdf: () => void;
  onExportToCsv: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  storiesExist,
  onBackClick,
  onCreateStory,
  onExportToPdf,
  onExportToCsv
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBackClick}
            className="rounded-full"
          >
            <ChevronLeft size={16} />
          </Button>
          <h2 className="text-2xl font-semibold tracking-tight">{project.name}</h2>
        </div>
        <div className="flex items-center gap-2">
          {storiesExist && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download size={16} />
                  <span>Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onExportToPdf}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Export as PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExportToCsv}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <span>Export as CSV</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button 
            onClick={onCreateStory}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Create New Story</span>
          </Button>
        </div>
      </div>
      
      {project.description && (
        <p className="text-muted-foreground">{project.description}</p>
      )}
    </div>
  );
};

export default ProjectHeader;
