
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface SuccessAlertProps {
  updatedInfo: {
    displayName: string;
    phoneNumber: string;
  } | null;
  show: boolean;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({ updatedInfo, show }) => {
  if (!show || !updatedInfo) return null;

  return (
    <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
      <AlertTitle className="text-green-800">Profile Updated Successfully</AlertTitle>
      <AlertDescription>
        <div className="mt-2">
          <p><strong>Display Name:</strong> {updatedInfo.displayName || "Not set"}</p>
          <p><strong>Phone Number:</strong> {updatedInfo.phoneNumber || "Not set"}</p>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default SuccessAlert;
