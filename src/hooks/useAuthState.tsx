
import { useState, useEffect, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getSession } from "@/utils/authUtils";

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);
  const initialized = useRef(false);

  useEffect(() => {
    // Set isMounted to true when the component mounts
    isMounted.current = true;
    
    // Prevent duplicate initialization
    if (initialized.current) return;
    initialized.current = true;
    
    const initializeAuth = async () => {
      try {
        console.log("useAuthState: Initializing auth state");
        
        // Set up auth state change listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, newSession) => {
            console.log("Auth state changed, event:", _event);
            if (isMounted.current) {
              setSession(newSession);
              setUser(newSession?.user ?? null);
              // Only update loading after initial session check
              if (loading) {
                setLoading(false);
              }
            }
          }
        );
        
        // Then check for existing session
        const { session: initialSession, user: initialUser } = await getSession();
        if (isMounted.current) {
          setSession(initialSession);
          setUser(initialUser);
          setLoading(false);
        }
        
        // Ensure loading state is cleared even if there's no auth state change event
        setTimeout(() => {
          if (isMounted.current && loading) {
            console.log("Forcing loading state to complete after timeout");
            setLoading(false);
          }
        }, 3000); // 3 second safety timeout
        
        return () => {
          if (subscription) subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    const cleanupPromise = initializeAuth();
    
    return () => {
      // Set isMounted to false when the component unmounts
      isMounted.current = false;
      
      // Clean up the subscription
      cleanupPromise.then(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
    };
  }, []); // Empty dependency array so this only runs once

  return { session, user, loading, setLoading };
};
