
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

  // Debugging message in console to verify component loading
  console.log("Auth component rendering", {
    components: { AuthHeader, AuthForm, AuthFooter },
    state: { localLoading, isProcessingOAuth }
  });

  // For debugging - render a simplified view to check if basic rendering works
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="py-4 px-6 bg-white border-b">
        <div className="max-w-6xl mx-auto">
          <div className="font-bold text-xl text-primary">SonicStories</div>
        </div>
      </header>

      <main className="flex-1 py-12 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border">
          <h1 className="text-2xl font-bold mb-6 text-center">Authentication Page</h1>
          
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
        </div>
      </main>

      <footer className="py-6 border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} SonicStories. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Auth;
