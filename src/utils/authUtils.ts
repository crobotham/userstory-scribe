
import { supabase } from "@/integrations/supabase/client";
import type { Session, User, UserMetadata } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

export const getSession = async (): Promise<{ session: Session | null; user: User | null }> => {
  const { data } = await supabase.auth.getSession();
  return {
    session: data.session,
    user: data.session?.user ?? null
  };
};

export const signIn = async (email: string, password: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    toast({
      title: "Signed in successfully",
      description: "Welcome back!",
    });
  } catch (error: any) {
    toast({
      title: "Error signing in",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<void> => {
  try {
    // Get the current URL's origin (e.g., https://yourdomain.com)
    const origin = window.location.origin;
    
    // Set the redirect URL to the auth page on the current domain
    const redirectTo = `${origin}/auth`;
    
    console.log(`Starting Google sign-in with redirect URL: ${redirectTo}`);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });
    
    if (error) {
      console.error("OAuth initialization error:", error);
      throw error;
    }
    
    if (!data?.url) {
      console.error("No URL returned from OAuth provider");
      throw new Error("Authentication failed: Google did not provide a redirect URL");
    }
    
    console.log(`Google OAuth initialized successfully, redirecting to: ${data.url}`);
    
    // Redirect to the OAuth URL
    window.location.href = data.url;
    
  } catch (error: any) {
    console.error("Google sign-in error:", error);
    
    let errorMessage = "Failed to connect to Google authentication.";
    
    if (error.message?.includes("refused to connect")) {
      errorMessage = "Your browser couldn't connect to Google's authentication servers. This might be due to network restrictions, firewall settings, or browser security features.";
    } else if (error.message?.includes("popup")) {
      errorMessage = "Google sign-in popup was blocked. Please allow popups for this site.";
    } else if (!navigator.onLine) {
      errorMessage = "You appear to be offline. Please check your internet connection.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast({
      title: "Google Sign-In Failed",
      description: errorMessage,
      variant: "destructive",
    });
    
    throw error;
  }
};

export const signUp = async (email: string, password: string, metadata?: UserMetadata): Promise<{success: boolean; error?: string; isExistingUser?: boolean}> => {
  try {
    // Add additional logging to help debug
    console.log("Starting signup process with metadata:", metadata);
    
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata || {},
      },
    });

    if (error) {
      console.error("Signup error:", error);
      
      // Check if the error is because the user already exists
      if (error.message?.includes("User already registered") || 
          error.message?.includes("already registered") || 
          error.status === 422) {
        return { 
          success: false, 
          error: "This email is already registered. Please sign in instead.", 
          isExistingUser: true 
        };
      }
      
      throw error;
    }
    
    console.log("User created successfully:", data);
    
    // Send welcome email
    try {
      const userName = metadata?.displayName || '';
      await sendWelcomeEmail(email, userName);
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // We don't throw here as the signup was successful
    }
    
    toast({
      title: "Account created",
      description: "Please check your email to confirm your account.",
    });
    
    return { success: true };
  } catch (error: any) {
    console.error("Error in signup function:", error);
    toast({
      title: "Error creating account",
      description: error.message,
      variant: "destructive",
    });
    return { success: false, error: error.message };
  }
};

export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    toast({
      title: "Signed out successfully",
    });
  } catch (error: any) {
    toast({
      title: "Error signing out",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};

// Add a new function to send welcome email
const sendWelcomeEmail = async (email: string, name?: string): Promise<void> => {
  try {
    const { error } = await supabase.functions.invoke('send-welcome-email', {
      body: { email, name },
    });
    
    if (error) {
      console.error("Error sending welcome email:", error);
      throw error;
    }
    
    console.log("Welcome email sent successfully to:", email);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    // We don't re-throw as this shouldn't break the signup flow
  }
};
