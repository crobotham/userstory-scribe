
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useAdminCheck() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsChecking(false);
        return;
      }

      try {
        console.log("Checking admin role for user:", user.id);
        const { data, error } = await supabase
          .rpc('has_role', { _user_id: user.id, _role: 'admin' });

        if (error) {
          console.error("Error checking admin role:", error);
          toast({
            title: "Error",
            description: "Could not verify admin permissions. Please try again.",
            variant: "destructive",
          });
          setIsAdmin(false);
        } else {
          console.log("Admin check result:", data);
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error("Error in admin role check:", error);
        setIsAdmin(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminRole();
  }, [user, toast]);

  useEffect(() => {
    if (!isChecking && user && !isAdmin) {
      console.log("User is not admin, redirecting to blog");
      navigate('/blog');
      toast({
        title: "Access Denied",
        description: "You don't have permission to manage blog posts.",
        variant: "destructive",
      });
    }
  }, [isAdmin, navigate, user, toast, isChecking]);

  return { isAdmin, isChecking };
}
