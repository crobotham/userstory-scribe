
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import ExistingUserDialog from "@/components/auth/ExistingUserDialog";
import SignUpSuccessModal from "@/components/auth/SignUpSuccessModal";
import SignUpFormFields from "@/components/auth/SignUpFormFields";
import SignUpFormActions from "@/components/auth/SignUpFormActions";
import { useSignUpForm } from "@/hooks/useSignUpForm";

interface SignUpFormProps {
  onSignUpSuccess?: () => void;
}

const SignUpForm = ({ onSignUpSuccess }: SignUpFormProps) => {
  const {
    email, setEmail,
    password, setPassword,
    passwordConfirm, setPasswordConfirm,
    firstName, setFirstName,
    lastName, setLastName,
    phoneNumber, setPhoneNumber,
    businessName, setBusinessName,
    acceptTerms, setAcceptTerms,
    error,
    isLoading,
    showExistingUserDialog, setShowExistingUserDialog,
    showSuccessModal,
    handleSubmit,
    handleGoogleSignIn,
    handleCloseSuccessModal
  } = useSignUpForm(onSignUpSuccess);

  return (
    <>
      <Card className="border-none shadow-lg">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <SignUpFormFields 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              passwordConfirm={passwordConfirm}
              setPasswordConfirm={setPasswordConfirm}
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              businessName={businessName}
              setBusinessName={setBusinessName}
              acceptTerms={acceptTerms}
              setAcceptTerms={setAcceptTerms}
            />

            <SignUpFormActions 
              isLoading={isLoading}
              onGoogleSignIn={handleGoogleSignIn}
            />
          </form>
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-center p-6">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
      
      <ExistingUserDialog 
        isOpen={showExistingUserDialog} 
        onOpenChange={setShowExistingUserDialog} 
      />

      <SignUpSuccessModal
        isOpen={showSuccessModal}
        onOpenChange={handleCloseSuccessModal}
      />
    </>
  );
};

export default SignUpForm;
