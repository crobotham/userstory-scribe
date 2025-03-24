
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/components/blog/BlogPostTypes";
import { blogFormSchema, BlogFormData } from "@/components/blog/BlogFormSchema";

export function useBlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);
  const isEditing = !!id;

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
      author: "",
      category: "announcement",
      is_popular: false,
      is_featured: false,
      image_url: "",
    },
  });

  // Fetch post data when editing
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setIsFetching(true);
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data) {
          const postData = data as unknown as BlogPost;
          form.reset({
            title: postData.title,
            summary: postData.summary,
            content: postData.content,
            author: postData.author,
            category: postData.category,
            is_popular: postData.is_popular,
            is_featured: postData.is_featured || false,
            image_url: postData.image_url || "",
          });
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        toast({
          title: "Error",
          description: "Failed to load blog post data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    if (isEditing) {
      fetchPost();
    }
  }, [id, form, toast, isEditing]);

  // Handle form submission
  const onSubmit = async (data: BlogFormData) => {
    try {
      setIsLoading(true);
      console.log('Submitting blog post:', data);
      
      if (isEditing) {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (error) {
          console.error('Error updating blog post:', error);
          throw error;
        }
        
        toast({
          title: "Success",
          description: "Blog post updated successfully!",
        });
      } else {
        const { data: insertedData, error } = await supabase
          .from('blog_posts')
          .insert([{
            title: data.title,
            summary: data.summary,
            content: data.content,
            author: data.author,
            category: data.category,
            is_popular: data.is_popular,
            is_featured: data.is_featured,
            image_url: data.image_url || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select();

        if (error) {
          console.error('Error creating blog post:', error);
          throw error;
        }
        
        console.log('Blog post created successfully:', insertedData);
        
        toast({
          title: "Success",
          description: "Blog post created successfully!",
        });
      }
      
      navigate('/blog');
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} blog post: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    isFetching,
    isEditing,
    onSubmit,
    navigate
  };
}
