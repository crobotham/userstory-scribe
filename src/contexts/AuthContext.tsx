
import React, { createContext, useContext } from "react";
import type { Session, User, UserMetadata } from "@supabase/supabase-js";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthCallback } from "@/hooks/useAuthCallback";
import { signIn, signUp, signInWithGoogle, signOut, getSession } from "@/utils/authUtils";

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<{success: boolean; error?: string; isExistingUser?: boolean}>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { session, user, loading: stateLoading, setLoading } = useAuthState();
  const { loading: callbackLoading } = useAuthCallback();
  
  const loading = stateLoading || callbackLoading;

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signIn(email, password);
    } catch (error) {
      // Error is already handled in the signIn function
      console.error("Sign in error handled in authUtils:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      // Note: We don't reset loading state here because we're redirecting to Google
      // The loading state will be reset when we return from Google and process the callback
    } catch (error) {
      // Error is already handled in the signInWithGoogle function
      console.error("Google sign-in error handled in authUtils:", error);
      setLoading(false); // Reset loading only if there's an error
    }
  };

  const handleSignUp = async (email: string, password: string, metadata?: UserMetadata): Promise<{success: boolean; error?: string; isExistingUser?: boolean}> => {
    setLoading(true);
    try {
      console.log("Starting signup in AuthContext with metadata:", metadata);
      const result = await signUp(email, password, metadata);
      console.log("Signup result:", result);
      
      if (result.success) {
        // Refresh the session if signup was successful
        const { session, user } = await getSession();
        // These will be picked up by the auth state listener
      }
      return result;
    } catch (error) {
      console.error("Error in signup context handler:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
    } catch (error) {
      // Error is already handled in the signOut function
      console.error("Sign out error handled in authUtils:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        session, 
        user, 
        signIn: handleSignIn, 
        signUp: handleSignUp, 
        signInWithGoogle: handleSignInWithGoogle, 
        signOut: handleSignOut, 
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
