
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { supportFormSchema, SupportFormValues } from "./supportFormSchema";
import SupportFormFields from "./SupportFormFields";
import { useSupportFormSubmit } from "@/hooks/useSupportFormSubmit";

interface SupportFormProps {
  onSubmitSuccess: (data: SupportFormValues) => void;
}

const SupportForm: React.FC<SupportFormProps> = ({ onSubmitSuccess }) => {
  const navigate = useNavigate();
  
  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      urgent: false,
    },
    mode: "onBlur", // Validate fields when they lose focus
  });

  const { handleSubmit, isSubmitting, submissionError } = useSupportFormSubmit({
    onSubmitSuccess,
  });

  const onSubmit = (data: SupportFormValues) => {
    handleSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a Support Request</CardTitle>
        <CardDescription>
          Please provide as much detail as possible so we can help you better.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submissionError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submissionError}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <SupportFormFields form={form} />

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : "Submit Request"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SupportForm;
