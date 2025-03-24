
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SupportFormValues } from "@/components/support/supportFormSchema";

interface UseSupportFormSubmitProps {
  onSubmitSuccess: (data: SupportFormValues) => void;
}

export const useSupportFormSubmit = ({ onSubmitSuccess }: UseSupportFormSubmitProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSubmit = async (data: SupportFormValues) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      const { data: responseData, error } = await supabase.functions.invoke("send-support-email", {
        body: data,
      });
      
      if (error) throw new Error(error.message || "Error sending support request");
      
      // Check if we had a partial success (admin notified but confirmation email failed)
      if (responseData?.userEmail?.error) {
        console.warn("Support request was received but confirmation email failed:", responseData.userEmail.error);
        toast({
          title: "Support request received",
          description: "Your request was received, but we couldn't send you a confirmation email. We'll still get back to you soon.",
        });
      } else {
        toast({
          title: "Support request sent!",
          description: "We'll get back to you as soon as possible.",
        });
      }
      
      onSubmitSuccess(data);
    } catch (error) {
      console.error("Error sending support request:", error);
      setSubmissionError(
        error instanceof Error 
          ? error.message 
          : "Failed to send your request. Please try again later or email us directly."
      );
      toast({
        title: "Error sending request",
        description: "Please try again later or email us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
    submissionError,
  };
};
