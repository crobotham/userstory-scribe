
import React, { createContext, useContext } from "react";
import { useToast as useHookToast } from "@/hooks/use-toast";

// Create a context for toast functionality
const ToastContext = createContext<ReturnType<typeof useHookToast> | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get the toast implementation from the hook
  const toast = useHookToast();
  
  // Provide the toast context to all children
  return (
    <ToastContext.Provider value={toast}>
      {children}
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
