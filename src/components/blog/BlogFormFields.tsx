
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { BlogFormData } from "@/components/blog/BlogFormSchema";
import BlogAIAssistantWrapper from "./form/BlogAIAssistantWrapper";
import BlogFormBasicFields from "./form/BlogFormBasicFields";
import BlogFormMetadataFields from "./form/BlogFormMetadataFields";
import BlogFormToggleFields from "./form/BlogFormToggleFields";

interface BlogFormFieldsProps {
  form: UseFormReturn<BlogFormData>;
}

const BlogFormFields: React.FC<BlogFormFieldsProps> = ({ form }) => {
  return (
    <>
      <BlogAIAssistantWrapper form={form} />
      <BlogFormBasicFields form={form} />
      <BlogFormMetadataFields form={form} />
      <BlogFormToggleFields form={form} />
    </>
  );
};

export default BlogFormFields;
