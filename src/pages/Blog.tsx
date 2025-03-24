
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import FooterSection from "@/components/home/FooterSection";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogContent from "@/components/blog/BlogContent";
import BlogError from "@/components/blog/BlogError";
import { useBlogPosts } from "@/hooks/useBlogPosts";

const Blog = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isLoading, blogPosts, error } = useBlogPosts();
  const [isAdmin, setIsAdmin] = React.useState(false);

  // Check if the user has admin role
  React.useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .rpc('has_role', { _user_id: user.id, _role: 'admin' });

        if (error) {
          console.error("Error checking admin role:", error);
          return;
        }

        setIsAdmin(!!data);
      } catch (error) {
        console.error("Error in admin role check:", error);
      }
    };

    checkAdminRole();
  }, [user]);

  if (error) {
    return <BlogError error={error} />;
  }

  // This function is not implemented but needed for the interface
  const handleAddTestPost = () => {
    toast({
      title: "Coming Soon",
      description: "Test post creation functionality will be available soon."
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pb-16">
        <BlogHeader isAdmin={isAdmin} />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <BlogContent 
            isLoading={isLoading}
            blogPosts={blogPosts}
            isAdmin={isAdmin}
            onAddTestPost={handleAddTestPost}
          />
        </div>
      </main>
      
      <FooterSection />
    </div>
  );
};

export default Blog;
