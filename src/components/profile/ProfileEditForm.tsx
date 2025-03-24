
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileEditFormProps {
  displayName: string;
  phoneNumber: string;
  phoneError: string;
  isLoading: boolean;
  onDisplayNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  displayName,
  phoneNumber,
  phoneError,
  isLoading,
  onDisplayNameChange,
  onPhoneNumberChange,
  onSubmit,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-xl font-medium mb-4">Edit Profile</h2>
      
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          value={displayName}
          onChange={onDisplayNameChange}
          placeholder="Your display name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          value={phoneNumber}
          onChange={onPhoneNumberChange}
          placeholder="+1 (555) 123-4567"
          className={phoneError ? "border-red-500" : ""}
        />
        {phoneError && (
          <p className="text-sm text-red-500 mt-1">{phoneError}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Enter in international format (E.164): +1XXXXXXXXXX for US numbers
        </p>
      </div>
      
      <div className="flex gap-4 pt-2">
        <Button 
          type="submit" 
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
        
        <Button 
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
