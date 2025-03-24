
import React, { ReactNode } from "react";
import Header from "@/components/Header";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="max-w-xl mx-auto px-4">
          {children}
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="max-w-5xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Crafted with simplicity and elegance in mind</p>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
