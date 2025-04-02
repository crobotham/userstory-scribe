
import React, { useState } from "react";
import { UserStory } from "@/utils/story";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trash, 
  Edit,
  MoreVertical,
  FileText,
  Download,
  FileSpreadsheet
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { exportSingleStoryToExcel } from "@/utils/story/exportService";
import { exportStoryToPdf } from "@/utils/story/exportPdfService";

interface StoryCardProps {
  story: UserStory;
  onEdit: (story: UserStory) => void;
  onDelete: (storyId: string) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onEdit, onDelete }) => {
  const priorityColors: Record<string, string> = {
    "High": "bg-red-100 text-red-800",
    "Medium": "bg-yellow-100 text-yellow-800",
    "Low": "bg-green-100 text-green-800"
  };
  
  const handleExportToPdf = () => {
    exportStoryToPdf(story);
  };
  
  const handleExportToCsv = () => {
    exportSingleStoryToExcel(story);
  };
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <Badge className={priorityColors[story.priority] || "bg-blue-100 text-blue-800"}>
            {story.priority} Priority
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(story)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(story.id)}>
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportToPdf}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Export as PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportToCsv}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                <span>Export as CSV</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <p className="text-sm mb-3">
          <span className="font-semibold">{story.projectName}</span>
        </p>
        
        <p className="mb-4">{story.storyText}</p>
        
        {story.acceptanceCriteria.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-1">Acceptance Criteria:</h4>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              {story.acceptanceCriteria.slice(0, 2).map((criteria, index) => (
                <li key={index} className="truncate">{criteria}</li>
              ))}
              {story.acceptanceCriteria.length > 2 && (
                <li className="text-primary">+{story.acceptanceCriteria.length - 2} more</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 pb-4">
        <div className="text-xs text-muted-foreground">
          Created {new Date(story.createdAt).toLocaleDateString()}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(story.id)}
            className="h-8 px-2"
          >
            <Trash size={14} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(story)}
            className="h-8 px-2"
          >
            <Edit size={14} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StoryCard;
