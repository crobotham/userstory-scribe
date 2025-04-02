
import React from "react";
import { UserStory } from "@/utils/story";
import { useToast } from "@/hooks/use-toast";
import { exportStoriesToExcel } from "@/utils/story/exportService";
import { exportStoriesToPdf } from "@/utils/story/exportPdfService";

interface ExportHandlersProps {
  stories: UserStory[];
  projectName: string;
}

export const useExportHandlers = ({ stories, projectName }: ExportHandlersProps) => {
  const { toast } = useToast();
  
  const handleExportToPdf = () => {
    if (stories.length === 0) {
      toast({
        title: "No stories to export",
        description: "Create some stories first before exporting.",
        variant: "destructive",
      });
      return;
    }
    
    exportStoriesToPdf(stories, projectName);
    toast({
      title: "Export successful",
      description: "Your stories have been exported to PDF",
    });
  };
  
  const handleExportToCsv = () => {
    if (stories.length === 0) {
      toast({
        title: "No stories to export",
        description: "Create some stories first before exporting.",
        variant: "destructive",
      });
      return;
    }
    
    exportStoriesToExcel(stories);
    toast({
      title: "Export successful",
      description: "Your stories have been exported to CSV",
    });
  };

  return {
    handleExportToPdf,
    handleExportToCsv
  };
};
