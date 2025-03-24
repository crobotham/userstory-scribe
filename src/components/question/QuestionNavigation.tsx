
import React from "react";
import { Button } from "@/components/ui/button";

interface QuestionNavigationProps {
  onNext: () => void;
  onBack?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  isNextDisabled: boolean;
  isOptional?: boolean;
  hideNext?: boolean; // New prop to hide the Next/Continue button
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  onNext,
  onBack,
  isFirst = false,
  isLast = false,
  isNextDisabled,
  isOptional = false,
  hideNext = false,
}) => {
  return (
    <div className="flex justify-between mt-8">
      {onBack && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="button-transition"
        >
          Back
        </Button>
      )}
      
      {!hideNext && (
        <div className="flex gap-2 ml-auto">
          {isOptional && (
            <Button
              type="button"
              variant="outline"
              onClick={onNext}
              className="button-transition"
            >
              Skip
            </Button>
          )}
          <Button
            type="button"
            onClick={onNext}
            disabled={isNextDisabled}
            className="button-transition"
          >
            {isLast ? "Generate Story" : "Continue"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuestionNavigation;
