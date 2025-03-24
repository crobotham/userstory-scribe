import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useAuthPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Start a timer to clear local loading state after a maximum time
  useEffect(() => {
    // Force loading to false immediately for testing
    setLocalLoading(false);
    
    const timer = setTimeout(() => {
      if (localLoading) {
        console.log("Auth page forcing loading state to complete after timeout");
        setLocalLoading(false);
      }
    }, 2000); // Reduced from 5000 to 2000 for faster loading
    
    return () => clearTimeout(timer);
  }, [localLoading]);

  // Log the current state
  useEffect(() => {
    console.log("useAuthPage hook state:", { 
      user, authLoading, localLoading, isProcessingOAuth 
    });
  }, [user, authLoading, localLoading, isProcessingOAuth]);

  // Check if we're processing an OAuth callback or if there are errors
  useEffect(() => {
    // Clear any previous errors
    setAuthError(null);
    
    // Check for OAuth process (access_token in hash)
    if (location.hash && location.hash.includes("access_token")) {
      console.log("Detected OAuth callback with access_token");
      setIsProcessingOAuth(true);
      // Don't set localLoading to false yet - wait for auth state to update
    } 
    // Check for error parameters in URL hash (common for auth errors)
    else if (location.hash && location.hash.includes("error")) {
      console.log("Detected error in URL hash:", location.hash);
      setIsProcessingOAuth(false);
      
      // Parse the hash to get error details
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const error = hashParams.get("error");
      const errorDescription = hashParams.get("error_description");
      
      if (error && errorDescription) {
        const formattedError = errorDescription.replace(/\+/g, " ");
        console.log("Authentication error:", error, formattedError);
        setAuthError(`${formattedError}`);
        
        // Show toast with error message
        toast({
          title: "Authentication Error",
          description: formattedError,
          variant: "destructive",
        });
        
        // Clear the URL hash without refreshing the page
        if (window.history.replaceState) {
          window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
        }
      }
      
      // Make sure the user can see the form
      setLocalLoading(false);
    } 
    // Not an OAuth callback or error, update loading state based on auth loading
    else {
      setLocalLoading(authLoading);
    }
  }, [location.hash, authLoading, toast]);

  // Check if we're handling a password reset
  useEffect(() => {
    // Check for recovery mode or reset confirmation in URL params
    const reset = searchParams.get("reset");
    const type = searchParams.get("type");
    
    if (type === "recovery") {
      console.log("Recovery mode detected in URL params");
      setIsPasswordReset(true);
      setLocalLoading(false);
    } else if (reset === "true") {
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
      setLocalLoading(false);
    }
  }, [searchParams, toast]);

  // Handle user authentication state changes
  useEffect(() => {
    // Wait for OAuth processing to complete before redirecting
    if (isProcessingOAuth) {
      console.log("Currently processing OAuth, waiting for completion");
      return;
    }
    
    // Check if we're in recovery mode (from URL parameter)
    const type = searchParams.get("type");
    const isRecoveryMode = type === "recovery";
    
    // If in recovery mode, force password reset form regardless of auth state
    if (isRecoveryMode) {
      console.log("User in recovery mode, showing password reset form");
      setIsPasswordReset(true);
      setLocalLoading(false);
      return;
    }
    
    // Handle authenticated user (but not in recovery mode)
    if (user && !isPasswordReset && !isProcessingOAuth && !isRecoveryMode) {
      console.log("User authenticated, redirecting to dashboard");
      navigate("/dashboard");
      return;
    }
    
    // If user is null and auth is no longer loading, then we're ready to show the login page
    if (!user && !authLoading) {
      console.log("User not authenticated, showing login form");
      setLocalLoading(false);
    }
  }, [user, navigate, isProcessingOAuth, isPasswordReset, authLoading, searchParams]);

  // Clear OAuth processing state when auth state changes
  useEffect(() => {
    if (!authLoading && isProcessingOAuth) {
      console.log("Auth loading completed, clearing OAuth processing state");
      setIsProcessingOAuth(false);
      
      // Check if we're in recovery mode before redirecting
      const type = searchParams.get("type");
      const isRecoveryMode = type === "recovery";
      
      // If we have a user after OAuth but we're not in recovery mode, redirect to dashboard
      if (user && !isRecoveryMode) {
        navigate("/dashboard");
      }
    }
  }, [authLoading, user, isProcessingOAuth, navigate, searchParams]);

  const handlePasswordResetSuccess = () => {
    setIsPasswordReset(false);
  };

  return {
    user,
    localLoading: false, // Force loading to false for now to debug
    isProcessingOAuth,
    isPasswordReset,
    authError,
    handlePasswordResetSuccess
  };
};
