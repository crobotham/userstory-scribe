
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  publicPaths?: string[];
  adminOnly?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  publicPaths = ['/blog', '/blog/'], 
  adminOnly = false 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(adminOnly);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const toastShown = useRef(false);
  
  // Check admin status if needed
  useEffect(() => {
    if (adminOnly && user) {
      const checkAdminRole = async () => {
        setIsCheckingAdmin(true);
        try {
          console.log("ProtectedRoute: Checking admin role for user:", user.id);
          const { data, error } = await supabase
            .rpc('has_role', { _user_id: user.id, _role: 'admin' });

          if (error) {
            console.error("ProtectedRoute: Error checking admin role:", error);
            setIsAdmin(false);
          } else {
            console.log("ProtectedRoute: Admin check result:", data);
            setIsAdmin(!!data);
          }
        } catch (error) {
          console.error("ProtectedRoute: Error in admin role check:", error);
          setIsAdmin(false);
        } finally {
          setIsCheckingAdmin(false);
        }
      };
      
      checkAdminRole();
    }
  }, [user, adminOnly]);
  
  // Handle auth redirects separately from render
  useEffect(() => {
    // Allow access to public paths without authentication
    const isPublicPath = publicPaths.some(path => 
      location.pathname === path || location.pathname.startsWith('/blog/')
    );
    
    if (isPublicPath && !adminOnly) {
      setShouldRedirect(false);
      return;
    }
    
    // Handle authentication redirects
    if (!loading && !user) {
      if (!toastShown.current) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access this page",
        });
        toastShown.current = true;
      }
      setShouldRedirect(true);
    }
    
    // Handle admin access redirects
    if (!loading && user && adminOnly && !isCheckingAdmin && !isAdmin) {
      if (!toastShown.current) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        toastShown.current = true;
      }
      setShouldRedirect(true);
    }
  }, [user, loading, adminOnly, isAdmin, isCheckingAdmin, location.pathname, toast]);
  
  // Allow access to public paths without authentication
  const isPublicPath = publicPaths.some(path => 
    location.pathname === path || location.pathname.startsWith('/blog/')
  );
  
  if (isPublicPath && !adminOnly) {
    return <>{children}</>;
  }

  // Show loading indicator while checking authentication
  if (loading || isCheckingAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Spinner className="h-8 w-8 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle redirects
  if (shouldRedirect) {
    if (!user) {
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }
    
    if (adminOnly && !isAdmin) {
      return <Navigate to="/blog" replace />;
    }
  }

  // Render the children if authenticated and has proper permissions
  return <>{children}</>;
};

export default ProtectedRoute;
