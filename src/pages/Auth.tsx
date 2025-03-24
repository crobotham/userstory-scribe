
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthForm from "@/components/auth/AuthForm";
import AuthFooter from "@/components/auth/AuthFooter";
import PasswordResetForm from "@/components/auth/PasswordResetForm";
import AuthLoading from "@/components/auth/AuthLoading";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuthPage } from "@/hooks/useAuthPage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const { 
    localLoading, 
    isProcessingOAuth, 
    isPasswordReset,
    authError,
    handlePasswordResetSuccess 
  } = useAuthPage();

  // Force password reset mode if the recovery parameter is in the URL
  const isRecoveryMode = searchParams.get("type") === "recovery";
  
  useEffect(() => {
    // Log the current state for debugging
    console.log("Auth page state:", {
      localLoading,
      isProcessingOAuth,
      isPasswordReset,
      isRecoveryMode,
      authError
    });
  }, [localLoading, isProcessingOAuth, isPasswordReset, isRecoveryMode, authError]);

  // For debugging - render a fallback if something is wrong
  if (!AuthHeader || !AuthForm || !AuthFooter) {
    console.error("Missing auth components:", { AuthHeader, AuthForm, AuthFooter });
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Page</h1>
        <p className="text-red-500">There was an error loading the authentication components.</p>
      </div>
    );
  }

  // Show loading state if we're still initializing or processing OAuth
  if (localLoading || isProcessingOAuth) {
    return (
      <AuthLayout>
        <AuthLoading 
          message={isProcessingOAuth ? "Completing authentication..." : "Loading..."}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      {authError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            {authError}. Please try requesting a new password reset link.
          </AlertDescription>
        </Alert>
      )}
      
      {(isPasswordReset || isRecoveryMode) ? (
        <PasswordResetForm onSuccess={handlePasswordResetSuccess} />
      ) : (
        <>
          <AuthHeader />
          <AuthForm />
          <AuthFooter />
        </>
      )}
    </AuthLayout>
  );
};

export default Auth;
