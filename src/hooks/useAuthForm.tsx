
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useAuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setConfirmPassword("");
    setDisplayName("");
    setPhoneNumber("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, { 
          displayName: displayName || undefined,
          phoneNumber: phoneNumber || undefined
        });
        toast({
          title: "Account created",
          description: "Please check your email to confirm your account.",
        });
      } else {
        await signIn(email, password);
        // Redirect to dashboard after successful login
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      
      // Provide more user-friendly error messages
      if (!isSignUp) {
        // Login-specific error messages
        if (err.message?.includes("Invalid login credentials") || 
            err.message?.includes("invalid credentials") ||
            err.message?.includes("user not found")) {
          setError("The email or password you entered is incorrect. Please try again or sign up for a new account.");
        } else if (err.message?.includes("confirmation")) {
          setError("Please confirm your email address before signing in.");
        } else {
          setError(err.message || "An error occurred during sign in. Please try again.");
        }
      } else {
        // Sign up-specific error messages
        setError(err.message || "An error occurred during sign up. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);
    
    try {
      await signInWithGoogle();
      // For Google sign-in, the redirect happens in the auth context after successful authentication
    } catch (err: any) {
      setError(err.message);
      setIsGoogleLoading(false);
    }
  };

  return {
    isSignUp,
    setIsSignUp,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    displayName,
    setDisplayName,
    phoneNumber,
    setPhoneNumber,
    error,
    setError,
    isLoading,
    isGoogleLoading,
    handleSubmit,
    handleGoogleSignIn,
    toggleAuthMode
  };
};
