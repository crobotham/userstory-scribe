
import React, { useState } from "react";
import Header from "@/components/Header";
import SupportForm from "@/components/support/SupportForm";
import { SupportFormValues } from "@/components/support/supportFormSchema";
import SupportConfirmation from "@/components/support/SupportConfirmation";

const Support = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<SupportFormValues | undefined>(undefined);

  const handleSubmitSuccess = (data: SupportFormValues) => {
    setFormData(data);
    setSubmitted(true);
  };

  const handleNewRequest = () => {
    setSubmitted(false);
    setFormData(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Support Center</h1>
            <p className="text-lg text-muted-foreground">
              Need help? We're here for you. Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          {submitted ? (
            <SupportConfirmation 
              formData={formData} 
              onNewRequest={handleNewRequest} 
            />
          ) : (
            <SupportForm onSubmitSuccess={handleSubmitSuccess} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Support;
