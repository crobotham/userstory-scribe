
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  backLink?: {
    to: string;
    label: string;
  };
}

const AuthLayout = ({ children, backLink }: AuthLayoutProps) => {
  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="py-4 px-6 bg-white border-b">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2" onClick={handleLinkClick}>
            <div className="font-bold text-xl text-primary">SonicStories</div>
          </Link>
          {backLink && (
            <Link to={backLink.to} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1" onClick={handleLinkClick}>
              <ArrowLeft className="h-4 w-4" />
              {backLink.label}
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 py-12 px-4">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </main>

      <footer className="py-6 border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} SonicStories. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
