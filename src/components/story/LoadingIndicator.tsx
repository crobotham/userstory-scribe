
import React, { useEffect, useState } from "react";
import { Loader2, RefreshCw, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface LoadingIndicatorProps {
  onRetry?: () => void;
  onCancel?: () => void;
  retryCount?: number;
  maxRetries?: number;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  onRetry, 
  onCancel,
  retryCount = 0,
  maxRetries = 2
}) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Initializing story generation...");
  const [isStuck, setIsStuck] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    const messages = [
      "Initializing story generation...",
      "Formatting user story...",
      "Applying project context...",
      "Finalizing your story...",
      "Almost there..."
    ];
    
    let currentStep = 0;
    let stuckTimer: NodeJS.Timeout;
    
    // Simulate progress with messages
    const interval = setInterval(() => {
      if (currentStep < messages.length) {
        setMessage(messages[currentStep]);
        setProgress(Math.min(100, (currentStep + 1) * 20));
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Set a timer to detect if we're stuck
        stuckTimer = setTimeout(() => {
          setIsStuck(true);
          setMessage("Generation is taking longer than expected...");
        }, 10000);
      }
    }, 800);
    
    // Timer to track elapsed time
    const elapsedTimer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => {
      clearInterval(interval);
      clearInterval(elapsedTimer);
      if (stuckTimer) clearTimeout(stuckTimer);
    };
  }, []);

  // If we're retrying, show a different message
  useEffect(() => {
    if (retryCount > 0) {
      setMessage(`Retrying generation (attempt ${retryCount} of ${maxRetries})...`);
      setProgress(10); // Reset progress on retry
      setIsStuck(false);
      setElapsedTime(0);
    }
  }, [retryCount, maxRetries]);
  
  // Show a timeout message if it's taking too long
  const showTimeoutUI = elapsedTime > 30;
  
  // Determine if we should show the stuck UI or timeout UI
  const showProblemUI = isStuck || showTimeoutUI;
  
  return (
    <div className="flex flex-col justify-center items-center h-60 space-y-4 animate-in fade-in">
      {showProblemUI ? (
        <>
          <RefreshCw className="h-10 w-10 text-yellow-500" />
          <div className="text-center">
            <p className="text-lg font-medium text-foreground mb-1">
              {showTimeoutUI 
                ? "This is taking longer than expected" 
                : message}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {showTimeoutUI
                ? "Your story might be saved already. You can check your story list or try again."
                : "The story generation process seems to be taking longer than expected"}
            </p>
            <div className="flex flex-row gap-2 justify-center">
              {onRetry && (
                <Button onClick={onRetry} variant="outline" size="sm">
                  Try Again
                </Button>
              )}
              {onCancel && (
                <Button onClick={onCancel} variant="destructive" size="sm">
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="text-center">
            <p className="text-lg font-medium text-foreground mb-1">{message}</p>
            <p className="text-sm text-muted-foreground">
              Please wait while we create your user story 
              {elapsedTime > 0 && ` (${elapsedTime}s)`}
            </p>
            {retryCount > 0 && (
              <p className="text-xs text-amber-600 mt-1">
                Previous attempt failed. Retrying...
              </p>
            )}
          </div>
          <div className="w-full max-w-xs mt-2">
            <Progress value={progress} className="h-2" />
          </div>
          {onCancel && (
            <Button 
              onClick={onCancel} 
              variant="ghost" 
              size="sm" 
              className="mt-2 text-muted-foreground" 
              aria-label="Cancel generation"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default LoadingIndicator;
