
import React, { useState } from "react";
import { UserStory } from "@/utils/storyGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface StoryOutputProps {
  story: UserStory;
}

const StoryOutput: React.FC<StoryOutputProps> = ({ story }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = async () => {
    try {
      const textToCopy = `
User Story: ${story.storyText}

Priority: ${story.priority}

Acceptance Criteria:
${story.acceptanceCriteria.map(criterion => `- ${criterion}`).join('\n')}

${story.additionalNotes ? `Additional Notes: ${story.additionalNotes}` : ''}
      `.trim();
      
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      
      toast({
        title: "Copied to clipboard",
        description: "The user story has been copied to your clipboard.",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually.",
        variant: "destructive",
      });
    }
  };
  
  // Format for priorities
  const priorityColors = {
    High: "bg-red-100 text-red-800 hover:bg-red-200",
    Medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    Low: "bg-green-100 text-green-800 hover:bg-green-200",
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold tracking-tight">Your User Story</h2>
        <p className="text-muted-foreground mt-2">Here's your formatted user story based on your inputs</p>
      </div>
      
      <Card className="card-shadow transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-medium">User Story</CardTitle>
            <Badge 
              className={priorityColors[story.priority as keyof typeof priorityColors]}
            >
              {story.priority} Priority
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="p-4 bg-secondary/50 rounded-md border border-border/40">
            <p className="text-lg">{story.storyText}</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Acceptance Criteria</h4>
            <ul className="space-y-2">
              {story.acceptanceCriteria.map((criterion, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary mr-2 mt-0.5">
                    <Check size={12} />
                  </span>
                  <span>{criterion}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {story.additionalNotes && (
            <div>
              <h4 className="font-medium mb-2">Additional Notes</h4>
              <p className="text-muted-foreground">{story.additionalNotes}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-2">
          <Button 
            onClick={copyToClipboard} 
            variant="outline" 
            className="w-full button-transition flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check size={16} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy to Clipboard</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StoryOutput;
