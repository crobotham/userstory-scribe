
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserRole();
    }
  }, [user]);

  const fetchUserRole = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_roles', { _user_id: user?.id });
      
      if (error) {
        console.error("Error fetching user role:", error);
        return;
      }
      
      if (data && data.length > 0) {
        setUserRole(data[0]);
      }
    } catch (error) {
      console.error("Error in fetchUserRole:", error);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col text-sm">
        <div>{user?.email}</div>
        {userRole && (
          <Badge variant="outline" className="mt-1 capitalize">
            {userRole}
          </Badge>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSignOut}
        disabled={isLoading}
      >
        {isLoading ? "Signing out..." : "Sign Out"}
      </Button>
    </div>
  );
};

export default UserProfile;
