
import React from "react";
import { useAuthForm } from "@/hooks/useAuthForm";

const AuthHeader = () => {
  const { isSignUp } = useAuthForm();

  return (
    <div className="flex flex-col gap-2 items-center text-center mb-8">
      <div className="inline-block">
        <span className="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary">
          User Story Creator
        </span>
      </div>
      <h1 className="text-4xl font-bold tracking-tight">
        {isSignUp ? "Create an Account" : "Sign In"}
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl">
        {isSignUp 
          ? "Join today to start creating user stories" 
          : "Sign in to continue creating user stories"}
      </p>
    </div>
  );
};

export default AuthHeader;
