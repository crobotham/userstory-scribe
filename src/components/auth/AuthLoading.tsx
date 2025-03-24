
import React from "react";
import { Spinner } from "@/components/ui/spinner";

interface AuthLoadingProps {
  message?: string;
}

const AuthLoading: React.FC<AuthLoadingProps> = ({ message = "Loading..." }) => {
  return (
    <div className="text-center py-10">
      <Spinner className="h-8 w-8 mx-auto mb-4" />
      <p className="text-muted-foreground mt-2">{message}</p>
    </div>
  );
};

export default AuthLoading;
