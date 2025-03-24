
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import FooterSection from "@/components/home/FooterSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import { useBlogForm } from "@/hooks/useBlogForm";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import BlogFormFields from "@/components/blog/BlogFormFields";
import BlogFormActions from "@/components/blog/BlogFormActions";
import BlogFormLoading from "@/components/blog/BlogFormLoading";

const BlogForm = () => {
  const navigate = useNavigate();
  const { isAdmin, isChecking } = useAdminCheck();
  const { 
    form, 
    isLoading, 
    isFetching, 
    isEditing,
    onSubmit,
  } = useBlogForm();

  if (isChecking || isFetching) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <BlogFormLoading />
        </main>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-6"
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
          
          <h1 className="text-3xl font-bold mb-8">
            {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <BlogFormFields form={form} />
                  <BlogFormActions 
                    isLoading={isLoading} 
                    isEditing={isEditing}
                    onCancel={() => navigate('/blog')}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <FooterSection />
    </div>
  );
};

export default BlogForm;
