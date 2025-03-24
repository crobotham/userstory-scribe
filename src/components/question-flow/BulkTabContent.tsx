
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import BulkStoryGenerator from "../BulkStoryGenerator";

interface BulkTabContentProps {
  onStoriesGenerated: () => void;
}

const BulkTabContent: React.FC<BulkTabContentProps> = ({ onStoriesGenerated }) => {
  return (
    <TabsContent value="bulk-generation" className="mt-6">
      <BulkStoryGenerator onStoriesGenerated={onStoriesGenerated} />
    </TabsContent>
  );
};

export default BulkTabContent;
