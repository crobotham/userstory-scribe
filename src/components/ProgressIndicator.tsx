
import React from "react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  totalSteps,
  currentStep,
  className,
}) => {
  return (
    <div className={cn("w-full flex gap-1.5 justify-center my-6", className)}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-1 rounded-full transition-all duration-300 ease-in-out",
            index < currentStep
              ? "bg-primary w-8"
              : index === currentStep
              ? "bg-primary/80 w-8"
              : "bg-muted w-4"
          )}
        />
      ))}
    </div>
  );
};

export default ProgressIndicator;
