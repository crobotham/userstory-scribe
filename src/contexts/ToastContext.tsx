
import React, { createContext, useContext, useCallback } from "react";
import { useToast as useHookToast } from "@/hooks/use-toast";

// Create a context for toast functionality
const ToastContext = createContext<ReturnType<typeof useHookToast> | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useHookToast();
  
  // Create a memoized version of the context value to prevent unnecessary rerenders
  const contextValue = React.useMemo(() => toast, [toast]);
  
  return (
    <ToastContext.Provider value={contextValue}>
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
