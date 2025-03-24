
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Sparkle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  isDashboard?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isDashboard = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  
  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };
  
  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-4 sm:px-6 max-w-7xl mx-auto justify-between">
        <div className="flex items-center gap-6 lg:gap-10">
          <Link to="/" className="font-semibold text-xl">
            SonicStories
          </Link>
          
          {!isDashboard && !user && (
            <nav className="hidden md:flex gap-6">
              <Link to="/contact" className="text-gray-600 hover:text-gray-900 font-medium">
                Contact
              </Link>
              <Link to="/pricing" className="text-gray-600 hover:text-gray-900 font-medium">
                Pricing
              </Link>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="hidden md:inline-flex"
              >
                <Sparkle className="h-4 w-4 mr-2" />
                Create Stories
              </Button>
              
              <Link 
                to="/stories" 
                className="hidden md:inline-flex text-gray-600 hover:text-gray-900 font-medium ml-2"
              >
                Manage Stories
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    Create Stories
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/stories')}>
                    Manage Stories
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden md:inline-flex">
                <Link to="/auth">Log In</Link>
              </Button>
              <Button asChild className="hidden md:inline-flex">
                <Link to="/signup">Start for Free</Link>
              </Button>
            </>
          )}
          
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {!user && (
                  <>
                    <Link to="/contact" className="text-gray-600 hover:text-gray-900 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
                      Contact
                    </Link>
                    <Link to="/pricing" className="text-gray-600 hover:text-gray-900 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
                      Pricing
                    </Link>
                  </>
                )}
                
                {!user && (
                  <>
                    <Button variant="ghost" asChild className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                      <Link to="/auth">Log In</Link>
                    </Button>
                    <Button asChild className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                      <Link to="/signup">Start for Free</Link>
                    </Button>
                  </>
                )}
                
                {user && (
                  <>
                    <Button 
                      variant="outline" 
                      className="justify-start" 
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Sparkle className="h-4 w-4 mr-2" />
                      Create Stories
                    </Button>
                    <Link 
                      to="/stories" 
                      className="text-gray-600 hover:text-gray-900 font-medium py-2" 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Manage Stories
                    </Link>
                    <Button variant="ghost" asChild className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                      <Link to="/profile">Profile</Link>
                    </Button>
                    <Button variant="ghost" className="justify-start text-red-500" onClick={handleSignOut}>
                      Log Out
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
