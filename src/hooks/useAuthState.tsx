
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getSession } from "@/utils/authUtils";

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const initializeAuth = async () => {
      try {
        // Set up auth state change listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            console.log("Auth state changed, event:", _event);
            if (isMounted) {
              setSession(session);
              setUser(session?.user ?? null);
              setLoading(false);
            }
          }
        );
        
        // Then check for existing session
        const { session, user } = await getSession();
        if (isMounted) {
          setSession(session);
          setUser(user);
          setLoading(false);
        }
        
        // Ensure loading state is cleared even if there's no auth state change event
        setTimeout(() => {
          if (isMounted && loading) {
            console.log("Forcing loading state to complete after timeout");
            setLoading(false);
          }
        }, 3000); // 3 second safety timeout
        
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const cleanup = initializeAuth();
    
    return () => {
      isMounted = false;
      cleanup.then(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
    };
  }, []);

  return { session, user, loading, setLoading };
};
