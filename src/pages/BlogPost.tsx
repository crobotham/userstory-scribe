
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import FooterSection from "@/components/home/FooterSection";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BlogPostSkeleton from "@/components/blog/BlogPostSkeleton";
import BlogPostError from "@/components/blog/BlogPostError";
import BlogPostContent from "@/components/blog/BlogPostContent";
import BlogPostNotFound from "@/components/blog/BlogPostNotFound";
import { useBlogPost } from "@/hooks/useBlogPost";
import { supabase } from "@/integrations/supabase/client";

const BlogPostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { post, isLoading, error, handleDelete } = useBlogPost(id);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if the user has admin role
  useEffect(() => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-6"
              onClick={() => navigate('/blog')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
            
            {isLoading ? (
              <BlogPostSkeleton />
            ) : error ? (
              <BlogPostError error={error} />
            ) : post ? (
              <BlogPostContent 
                post={post} 
                isAdmin={isAdmin} 
                onDelete={handleDelete} 
              />
            ) : (
              <BlogPostNotFound />
            )}
          </div>
        </div>
      </main>
      
      <FooterSection />
    </div>
  );
};

export default BlogPostPage;
