
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthLayout from "@/components/auth/AuthLayout";
import SignUpForm from "@/components/auth/SignUpForm";

const SignUp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useState(true);

  useEffect(() => {
    // Only redirect if user exists and it's not a new signup
    if (user && !isNewUser) {
      navigate("/dashboard");
    }
  }, [user, navigate, isNewUser]);

  return (
    <AuthLayout backLink={{ to: "/pricing", label: "Back to pricing" }}>
      <SignUpForm onSignUpSuccess={() => setIsNewUser(false)} />
    </AuthLayout>
  );
};

export default SignUp;
