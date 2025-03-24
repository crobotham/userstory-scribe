
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/components/blog/BlogPostTypes";

export const useBlogPosts = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching blog posts for all users...");
        
        // Enhanced query to troubleshoot - added debugging information
        const { data, error, status, statusText, count } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log("Blog posts fetch status:", status, statusText);
        console.log("Total blog posts count:", count);
        console.log("Blog posts data:", data);
        
        // Check if data is empty
        if (!data || data.length === 0) {
          console.log("No blog posts found in the database");
        }
        
        setBlogPosts(data || []);
      } catch (error: any) {
        console.error('Error fetching blog posts:', error);
        setError(error.message || "Failed to load blog posts");
        toast({
          title: "Error",
          description: "Failed to load blog posts. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, [toast]);

  return { isLoading, blogPosts, error };
};
