
import React from "react";
import { Link } from "react-router-dom";
import { useAuthForm } from "@/hooks/useAuthForm";

const AuthFooter = () => {
  const { isSignUp } = useAuthForm();
  
  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="mt-6 text-center">
      {isSignUp ? (
        <Link to="/auth" className="text-sm text-primary hover:underline" onClick={handleLinkClick}>
          Already have an account? Sign In
        </Link>
      ) : (
        <Link to="/signup" className="text-sm text-primary hover:underline" onClick={handleLinkClick}>
          Don't have an account? Sign Up
        </Link>
      )}
    </div>
  );
};

export default AuthFooter;
