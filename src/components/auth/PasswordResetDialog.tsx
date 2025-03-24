
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PasswordResetDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordResetDialog: React.FC<PasswordResetDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    if (!email || !email.trim()) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    try {
      // Get the current URL's origin (e.g., https://yourdomain.com)
      const origin = window.location.origin;
      
      // Set the redirect URL explicitly to the current domain with the recovery parameter
      // Making sure we get a complete URL with the protocol
      const redirectTo = `${origin}/auth?type=recovery`;
      
      console.log(`Sending password reset email to ${email} with redirect URL: ${redirectTo}`);
      
      const { error, data } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) throw error;

      console.log("Password reset email sent successfully", data);
      setSuccess(true);
      toast({
        title: "Password reset email sent",
        description: "Check your email inbox for a password reset link. Please use it within 1 hour.",
      });
      
      // Don't close the dialog immediately to show success state
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to send password reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you a link to reset your password.
            The link will expire after 1 hour.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-destructive/50 text-destructive">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              <AlertDescription className="text-sm font-medium">
                Reset link sent! Please check your email inbox and spam folder.
                Use the link within 1 hour.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || success}>
              {isLoading ? "Sending..." : success ? "Sent!" : "Send Reset Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordResetDialog;
