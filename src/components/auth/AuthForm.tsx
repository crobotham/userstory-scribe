
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import PasswordResetDialog from "@/components/auth/PasswordResetDialog";
import { useAuthForm } from "@/hooks/useAuthForm";

const AuthForm = () => {
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const {
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
    isLoading,
    isGoogleLoading,
    isSignUp,
    handleSubmit,
    handleGoogleSignIn
  } = useAuthForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="border-destructive/50 text-destructive">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
        />
      </div>

      {isSignUp && (
        <>
          <div className="space-y-2">
            <Label htmlFor="displayName">
              Display Name <span className="text-muted-foreground text-sm">(optional)</span>
            </Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">
              Phone Number <span className="text-muted-foreground text-sm">(optional)</span>
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          {!isSignUp && (
            <Button 
              type="button" 
              variant="link" 
              className="p-0 h-auto text-xs"
              onClick={() => setIsPasswordResetOpen(true)}
            >
              Forgot password?
            </Button>
          )}
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
        />
      </div>

      {isSignUp && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <GoogleSignInButton 
        onClick={handleGoogleSignIn}
        isLoading={isGoogleLoading}
        label={isSignUp ? "Sign up with Google" : "Sign in with Google"}
      />
      
      {/* Password Reset Dialog */}
      <PasswordResetDialog 
        isOpen={isPasswordResetOpen} 
        onClose={() => setIsPasswordResetOpen(false)} 
      />
    </form>
  );
};

export default AuthForm;
