
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

interface SignUpFormActionsProps {
  isLoading: boolean;
  onGoogleSignIn: () => void;
}

const SignUpFormActions = ({ isLoading, onGoogleSignIn }: SignUpFormActionsProps) => {
  return (
    <>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create account"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <GoogleSignInButton 
        onClick={onGoogleSignIn} 
        isLoading={isLoading}
        label="Sign up with Google"
      />
    </>
  );
};

export default SignUpFormActions;
