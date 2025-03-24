
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
  const [localLoading, setLocalLoading] = useState(false); // Start with false for debugging
  const [authError, setAuthError] = useState<string | null>(null);

  // Log the current state for debugging
  console.log("useAuthPage hook initialized", { 
    user, authLoading, localLoading, isProcessingOAuth 
  });

  // Check for recovery mode or reset confirmation in URL params
  useEffect(() => {
    const reset = searchParams.get("reset");
    const type = searchParams.get("type");
    
    console.log("URL params check:", { reset, type });
    
    if (type === "recovery") {
      console.log("Recovery mode detected in URL params");
      setIsPasswordReset(true);
    } else if (reset === "true") {
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
    }
  }, [searchParams, toast]);

  // Redirect authenticated users
  useEffect(() => {
    console.log("Auth state check for redirect:", { user });
    
    // If user is logged in and not in password reset mode, redirect to dashboard
    if (user && !isPasswordReset) {
      console.log("User is authenticated, redirecting to dashboard");
      navigate("/dashboard");
    }
  }, [user, isPasswordReset, navigate]);

  const handlePasswordResetSuccess = () => {
    setIsPasswordReset(false);
    toast({
      title: "Password reset successful",
      description: "Your password has been updated. You can now sign in.",
    });
  };

  return {
    user,
    localLoading,
    isProcessingOAuth,
    isPasswordReset,
    authError,
    handlePasswordResetSuccess
  };
};
