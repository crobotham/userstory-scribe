
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useSignUpForm = (onSignUpSuccess?: () => void) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showExistingUserDialog, setShowExistingUserDialog] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const { signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setShowSuccessModal(false);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!acceptTerms) {
      setError("You must accept the terms and conditions to continue");
      return;
    }
    
    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);

    try {
      const userData: { displayName: string; phoneNumber?: string } = {
        displayName: `${firstName} ${lastName}`.trim(),
      };

      if (phoneNumber) {
        userData.phoneNumber = phoneNumber;
      }

      const result = await signUp(email, password, userData);
      
      if (!result.success) {
        if (result.isExistingUser) {
          setShowExistingUserDialog(true);
          setError(null);
        } else {
          setError(result.error || "An error occurred during signup");
        }
      } else {
        if (businessName) {
          localStorage.setItem(`business_${email}`, businessName);
        }
        
        toast({
          title: "Account created successfully",
          description: "Welcome to our platform!",
        });
        
        setShowSuccessModal(true);
        
        if (onSignUpSuccess) {
          onSignUpSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      await signInWithGoogle();
      toast({
        title: "Redirecting to Google",
        description: "Please complete the sign in process",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccessModal = (open: boolean) => {
    setShowSuccessModal(open);
    if (!open) {
      navigate("/dashboard");
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    passwordConfirm, setPasswordConfirm,
    firstName, setFirstName,
    lastName, setLastName,
    phoneNumber, setPhoneNumber,
    businessName, setBusinessName,
    acceptTerms, setAcceptTerms,
    error, setError,
    isLoading,
    showExistingUserDialog, setShowExistingUserDialog,
    showSuccessModal,
    handleSubmit,
    handleGoogleSignIn,
    handleCloseSuccessModal
  };
};
