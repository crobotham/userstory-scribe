
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  handleSaveApiKey: () => void;
  setShowApiKeyInput: (show: boolean) => void;
  error: string | null;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  apiKey,
  setApiKey,
  handleSaveApiKey,
  setShowApiKeyInput,
  error
}) => {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Connect to OpenAI API to generate user stories. Your API key is stored only in your browser.
      </p>
      <Input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your OpenAI API key"
        className={error && error.includes("API key") ? "border-red-500" : ""}
      />
      <div className="flex gap-2">
        <Button 
          onClick={handleSaveApiKey} 
          size="sm" 
          variant="default"
          className="flex items-center gap-1"
        >
          <Check size={14} />
          Save Key
        </Button>
        {apiKey && (
          <Button 
            onClick={() => setShowApiKeyInput(false)} 
            size="sm" 
            variant="outline"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default ApiKeyInput;
