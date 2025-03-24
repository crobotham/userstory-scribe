
import React from "react";

interface ProfileHeaderProps {
  isEditMode: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ isEditMode }) => {
  return (
    <div className="flex flex-col gap-2 items-center text-center mb-8">
      <h1 className="text-4xl font-bold tracking-tight">Your Profile</h1>
      <p className="text-lg text-muted-foreground max-w-2xl">
        {isEditMode ? "Update your personal information" : "View your personal information"}
      </p>
    </div>
  );
};

export default ProfileHeader;
