
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getSession } from "@/utils/authUtils";

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useAuthState: Initializing auth state");
    let isMounted = true;
    let authStateUnsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        // Set up auth state change listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log("Auth state changed, event:", event);
            if (isMounted) {
              setSession(currentSession);
              setUser(currentSession?.user ?? null);
              // Only set loading to false after session is retrieved
              if (event !== 'INITIAL_SESSION') {
                setLoading(false);
              }
            }
          }
        );
        
        authStateUnsubscribe = () => subscription.unsubscribe();
        
        // Then check for existing session
        const existingSession = await getSession();
        if (isMounted) {
          console.log("useAuthState: Retrieved existing session:", !!existingSession.session);
          setSession(existingSession.session);
          setUser(existingSession.user);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();
    
    return () => {
      console.log("useAuthState: Cleaning up");
      isMounted = false;
      if (typeof authStateUnsubscribe === 'function') {
        authStateUnsubscribe();
      }
    };
  }, []);

  return { session, user, loading, setLoading };
};
