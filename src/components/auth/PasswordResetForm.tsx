
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, useNavigate } from "react-router-dom";

interface PasswordResetFormProps {
  onSuccess: () => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onSuccess }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Log the recovery flow for debugging
  useEffect(() => {
    console.log("Recovery mode active. Showing password reset form.");
    console.log("URL parameters:", Object.fromEntries(searchParams.entries()));
  }, [searchParams]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    
    if (newPassword !== confirmNewPassword) {
      setResetError("Passwords do not match.");
      return;
    }
    
    if (newPassword.length < 6) {
      setResetError("Password must be at least 6 characters long.");
      return;
    }
    
    setResetLoading(true);
    
    try {
      console.log("Attempting to update password...");
      const { error, data } = await supabase.auth.updateUser({ password: newPassword });
      
      console.log("Password update response:", { error, data });
      
      if (error) throw error;
      
      setResetSuccess(true);
      toast({
        title: "Password updated",
        description: "Your password has been successfully reset.",
      });
      
      // Clear reset parameters from URL
      if (window.history.replaceState) {
        window.history.replaceState(null, document.title, window.location.pathname);
      }
      
      // Sign out the user after successful password reset
      await supabase.auth.signOut();
      
      console.log("User signed out after password reset, will redirect to login shortly");
      
      // Redirect to login after showing success message for 3 seconds
      setTimeout(() => {
        console.log("Redirecting to login page");
        // Call onSuccess to update the parent component state
        onSuccess();
        // Navigate to the auth page for login
        navigate("/auth");
      }, 3000);
      
    } catch (error: any) {
      console.error("Error resetting password:", error);
      setResetError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Reset Your Password</h1>
        <p className="text-muted-foreground mt-2">Please enter your new password below.</p>
      </div>
      
      {resetSuccess ? (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <Check className="h-4 w-4 mr-2 text-green-600" />
          <AlertDescription className="text-sm font-medium">
            Password reset successful! Redirecting you to login...
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handlePasswordReset} className="space-y-4">
          {resetError && (
            <Alert variant="destructive" className="border-destructive/50 text-destructive">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription className="text-sm font-medium">{resetError}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input
              id="confirmNewPassword"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={resetLoading}>
            {resetLoading ? "Updating..." : "Reset Password"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default PasswordResetForm;
