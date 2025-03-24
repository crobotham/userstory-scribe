
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { SupportFormValues } from "./supportFormSchema";

interface SupportConfirmationProps {
  formData?: SupportFormValues;
  onNewRequest: () => void;
}

const SupportConfirmation: React.FC<SupportConfirmationProps> = ({ 
  formData, 
  onNewRequest 
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold">Thank You!</h2>
          <Alert className="bg-green-50 border-green-200">
            <AlertTitle>Support Request Submitted Successfully</AlertTitle>
            <AlertDescription>
              We've received your support request and will respond to your email as soon as possible.
              A confirmation email has also been sent to your inbox.
            </AlertDescription>
          </Alert>
          <div className="pt-4">
            <Button onClick={onNewRequest}>Submit Another Request</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportConfirmation;
