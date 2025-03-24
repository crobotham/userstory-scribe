
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface SignUpSuccessModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SignUpSuccessModal = ({ isOpen, onOpenChange }: SignUpSuccessModalProps) => {
  const navigate = useNavigate();

  const handleRedirectToDashboard = () => {
    onOpenChange(false);
    navigate("/dashboard");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <Sparkles className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-center text-xl">Account Created Successfully!</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Welcome to our platform! Your account has been created and you're ready to start creating user stories.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center sm:justify-center pt-4">
          <Button 
            size="lg" 
            onClick={handleRedirectToDashboard}
            className="w-full sm:w-auto gap-2"
          >
            Create your First User Stories!
            <Sparkles className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpSuccessModal;
