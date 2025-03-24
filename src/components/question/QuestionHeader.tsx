
import React from "react";

interface QuestionHeaderProps {
  question: string;
  description?: string;
  isOptional?: boolean;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  question,
  description,
  isOptional = false,
}) => {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-medium tracking-tight mb-2">
        {question}
        {isOptional && <span className="text-sm font-normal text-muted-foreground ml-2">(Optional)</span>}
      </h2>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default QuestionHeader;
