
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProfileInfoDisplayProps {
  displayData: {
    displayName: string;
    phoneNumber: string;
    email: string;
    createdAt: string;
    role?: string;
  };
  onEditClick: () => void;
  onBackClick: () => void;
}

const ProfileInfoDisplay: React.FC<ProfileInfoDisplayProps> = ({ 
  displayData, 
  onEditClick,
  onBackClick
}) => {
  return (
    <>
      <div className="mb-8 p-6 bg-muted rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Account Information</h2>
          <Button variant="outline" onClick={onEditClick}>
            Edit Profile
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p className="text-lg">{displayData.email}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Display Name</h3>
            <p className="text-lg">{displayData.displayName}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
            <p className="text-lg">{displayData.phoneNumber}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Account Created</h3>
            <p className="text-lg">{displayData.createdAt}</p>
          </div>
          
          {displayData.role && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Permission Level</h3>
              <p className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="capitalize">
                  {displayData.role}
                </Badge>
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="button"
          variant="outline"
          onClick={onBackClick}
        >
          Back to Home
        </Button>
      </div>
    </>
  );
};

export default ProfileInfoDisplay;
