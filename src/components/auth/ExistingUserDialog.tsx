
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ExistingUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExistingUserDialog = ({ isOpen, onOpenChange }: ExistingUserDialogProps) => {
  const navigate = useNavigate();

  const handleRedirectToLogin = () => {
    onOpenChange(false);
    navigate("/auth");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Account Already Exists</AlertDialogTitle>
          <AlertDialogDescription>
            An account with this email address already exists. Would you like to sign in instead?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleRedirectToLogin}>
            Go to Sign In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExistingUserDialog;
