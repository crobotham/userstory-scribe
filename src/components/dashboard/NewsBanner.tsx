
import React from "react";
import { Bell, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const NewsBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [announcementPostId, setAnnouncementPostId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Check if the banner was dismissed in this session
    const checkBannerState = () => {
      const bannerDismissed = sessionStorage.getItem('announcementBannerDismissed') === 'true';
      if (bannerDismissed) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    // Check banner state when component mounts or when user changes
    checkBannerState();
    
    // We need to fetch the announcement post regardless of visibility
    fetchAnnouncementPost();
  }, [user]);

  const fetchAnnouncementPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('category', 'announcement')
        .eq('is_popular', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching announcement post:", error);
        return;
      }
      
      if (data) {
        setAnnouncementPostId(data.id);
      }
    } catch (error) {
      console.error("Error in fetchAnnouncementPost:", error);
    }
  };

  const handleLearnMore = () => {
    if (announcementPostId) {
      navigate(`/blog/${announcementPostId}`);
    } else {
      // Fallback to the blog list if no announcement post is found
      navigate('/blog');
      toast({
        title: "Blog post not found",
        description: "The announcement post could not be loaded.",
        variant: "destructive"
      });
    }
  };

  const handleDismiss = () => {
    // Store the dismissed state in session storage
    sessionStorage.setItem('announcementBannerDismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-primary/10 border-b mb-6">
      <div className="max-w-6xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center">
            <span className="flex p-2 rounded-lg bg-primary/20">
              <Bell className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <div className="ml-3 font-medium text-sm">
              <span className="md:hidden">SonicStories 1.0 Released!</span>
              <span className="hidden md:inline">
                SonicStories 1.0 Released! Read our latest blog post about AI story generation.
              </span>
            </div>
            <Badge variant="outline" className="ml-3 hidden sm:block">
              New
            </Badge>
          </div>
          <div className="flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm"
              onClick={handleLearnMore}
            >
              Learn more
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="ml-2"
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsBanner;
