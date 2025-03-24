
import React from "react";
import { Spinner } from "@/components/ui/spinner";

interface AuthLoadingProps {
  message?: string;
}

const AuthLoading: React.FC<AuthLoadingProps> = ({ message = "Loading..." }) => {
  return (
    <div className="text-center">
      <Spinner className="h-8 w-8 mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export default AuthLoading;
