import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

export const useAuthCallback = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authCallbackProcessed, setAuthCallbackProcessed] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const handleAuthCallback = async () => {
      // Only process auth callback once
      if (authCallbackProcessed) {
        setLoading(false);
        return;
      }
      
      // Check if there are auth parameters in the URL hash
      const hasAuthParams = window.location.hash && 
                            (window.location.hash.includes("access_token") || 
                             window.location.hash.includes("error"));
      
      // Check if we're in recovery mode
      const isRecoveryMode = searchParams.get("type") === "recovery";
      
      // If no auth parameters and not in recovery mode, nothing to process
      if (!hasAuthParams && !isRecoveryMode) {
        console.log("No auth parameters detected, skipping callback processing");
        setLoading(false);
        return;
      }
      
      console.log("Processing auth callback - Hash parameters or recovery mode detected");
      setLoading(true);
      setAuthCallbackProcessed(true);
      
      try {
        // For error parameters, we'll let useAuthPage handle them
        if (window.location.hash.includes("error")) {
          console.log("Error parameters detected in hash, will be handled by useAuthPage");
          setLoading(false);
          return;
        }
        
        // Get the current session which should include the OAuth token if present
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session) {
          console.log("Successfully authenticated via callback");
          
          // Check if we're in recovery mode
          if (isRecoveryMode) {
            console.log("Recovery mode detected, not cleaning hash params");
            // Don't save the session if we're in recovery mode since we need to stay on the reset password page
          } else {
            if (isMounted) {
              setSession(session);
              setUser(session.user);
            }
            
            // Clean up the URL by removing the hash but keep query params
            if (window.history.replaceState) {
              window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
            }
            
            toast({
              title: "Signed in successfully",
              description: "Welcome to SonicStories!",
            });
          }
        } else {
          console.log("No session found after callback processing");
        }
      } catch (error: any) {
        console.error("Error handling auth callback:", error);
        toast({
          title: "Authentication Error",
          description: error.message || "There was an error during authentication.",
          variant: "destructive",
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    handleAuthCallback();
    
    // Add a safety timeout to ensure loading state is cleared
    const safetyTimeout = setTimeout(() => {
      if (isMounted && loading) {
        console.log("Forcing auth callback loading state to complete after timeout");
        setLoading(false);
      }
    }, 3000);
    
    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
    };
  }, [toast, authCallbackProcessed, loading, searchParams]);

  return { loading, authCallbackProcessed };
};
