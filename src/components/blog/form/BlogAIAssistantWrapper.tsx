
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { BlogFormData } from "@/components/blog/BlogFormSchema";
import BlogAIAssistant from "../BlogAIAssistant";

interface BlogAIAssistantWrapperProps {
  form: UseFormReturn<BlogFormData>;
}

const BlogAIAssistantWrapper: React.FC<BlogAIAssistantWrapperProps> = ({ 
  form 
}) => {
  const handleApplyTitle = (title: string) => {
    form.setValue("title", title, { shouldValidate: true });
  };

  const handleApplySummary = (summary: string) => {
    form.setValue("summary", summary, { shouldValidate: true });
  };

  const handleApplyContent = (content: string) => {
    form.setValue("content", content, { shouldValidate: true });
  };

  return (
    <BlogAIAssistant 
      onApplyTitle={handleApplyTitle}
      onApplySummary={handleApplySummary}
      onApplyContent={handleApplyContent}
    />
  );
};

export default BlogAIAssistantWrapper;
