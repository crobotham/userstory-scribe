
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/components/blog/BlogPostTypes";

export const useBlogPost = (id: string | undefined) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!id) {
          setError("No blog post ID provided");
          setIsLoading(false);
          return;
        }

        // Validate if id is a valid UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
          setError("Invalid blog post ID format");
          setIsLoading(false);
          
          toast({
            title: "Error",
            description: "The blog post ID format is invalid. Please check the URL.",
            variant: "destructive",
          });
          return;
        }

        // Use generic type to work around TypeScript limitations
        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) {
          console.error('Error fetching blog post:', fetchError);
          setError("Failed to load blog post");
          
          toast({
            title: "Error",
            description: "Failed to load blog post. Please try again later.",
            variant: "destructive",
          });
        } else {
          setPost(data as unknown as BlogPost);
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBlogPost();
    }
  }, [id, toast]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Blog post deleted successfully",
        });
        
        navigate('/blog');
      } catch (error) {
        console.error('Error deleting blog post:', error);
        toast({
          title: "Error",
          description: "Failed to delete blog post. Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  return { post, isLoading, error, handleDelete };
};
