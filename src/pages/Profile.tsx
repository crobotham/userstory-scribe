import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// Utils
import { formatToE164, validatePhoneNumber } from "@/utils/profile";

// Components
import PageLayout from "@/components/profile/PageLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SuccessAlert from "@/components/profile/SuccessAlert";
import ProfileInfoDisplay from "@/components/profile/ProfileInfoDisplay";
import ProfileEditForm from "@/components/profile/ProfileEditForm";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [updatedInfo, setUpdatedInfo] = useState<{
    displayName: string;
    phoneNumber: string;
  } | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const [isEditMode, setIsEditMode] = useState(false);
  
  useEffect(() => {
    if (user?.user_metadata) {
      setDisplayName(user.user_metadata.displayName || "");
      setPhoneNumber(user.user_metadata.phoneNumber || "");
    }
    
    if (user) {
      fetchUserRole();
    }
  }, [user]);

  const fetchUserRole = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_roles', { _user_id: user?.id });
      
      if (error) {
        console.error("Error fetching user role:", error);
        return;
      }
      
      if (data && data.length > 0) {
        setUserRole(data[0]);
      }
    } catch (error) {
      console.error("Error in fetchUserRole:", error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setPhoneError("");
    
    const formattedPhone = formatToE164(phoneNumber);
    
    if (!validatePhoneNumber(formattedPhone)) {
      setPhoneError("Invalid phone number. Please use a valid format like: +1XXXXXXXXXX");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Updating profile with:", { 
        displayName, 
        phoneNumber: formattedPhone 
      });
      
      const metadataUpdateResult = await supabase.auth.updateUser({
        data: {
          displayName,
          phoneNumber: formattedPhone
        },
      });
      
      if (metadataUpdateResult.error) throw metadataUpdateResult.error;
      
      setUpdatedInfo({
        displayName,
        phoneNumber: formattedPhone
      });
      
      setShowSuccess(true);
      setIsEditMode(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setPhoneError("");
      
      if (user?.user_metadata) {
        setDisplayName(user.user_metadata.displayName || "");
        setPhoneNumber(user.user_metadata.phoneNumber || "");
      }
    } else {
      navigate("/");
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    setShowSuccess(false);
  };

  const displayData = {
    displayName: updatedInfo ? updatedInfo.displayName : user?.user_metadata?.displayName || "Not set",
    phoneNumber: updatedInfo ? updatedInfo.phoneNumber : user?.user_metadata?.phoneNumber || "Not set",
    email: user?.email || "Not available",
    createdAt: user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown date",
    role: userRole || undefined
  };

  return (
    <PageLayout>
      <ProfileHeader isEditMode={isEditMode} />
      
      <SuccessAlert updatedInfo={updatedInfo} show={showSuccess} />
      
      {isEditMode ? (
        <ProfileEditForm
          displayName={displayName}
          phoneNumber={phoneNumber}
          phoneError={phoneError}
          isLoading={isLoading}
          onDisplayNameChange={(e) => setDisplayName(e.target.value)}
          onPhoneNumberChange={(e) => setPhoneNumber(e.target.value)}
          onSubmit={handleUpdateProfile}
          onCancel={handleCancel}
        />
      ) : (
        <ProfileInfoDisplay
          displayData={displayData}
          onEditClick={handleEditClick}
          onBackClick={handleCancel}
        />
      )}
    </PageLayout>
  );
};

export default Profile;
