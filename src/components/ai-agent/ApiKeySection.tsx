
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";

interface ApiKeySectionProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  apiKeyError: string;
  handleSaveApiKey: () => void;
  setShowApiKeyInput: (show: boolean) => void;
}

const ApiKeySection: React.FC<ApiKeySectionProps> = ({
  apiKey,
  setApiKey,
  apiKeyError,
  handleSaveApiKey,
  setShowApiKeyInput,
}) => {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Connect to OpenAI API to get intelligent suggestions. Your API key is stored only in your browser.
      </p>
      <div className="space-y-2">
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your OpenAI API key"
          className={apiKeyError ? "border-red-500" : ""}
        />
        {apiKeyError && (
          <p className="text-xs text-red-500">{apiKeyError}</p>
        )}
      </div>
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
            className="flex items-center gap-1"
          >
            <X size={14} />
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default ApiKeySection;
