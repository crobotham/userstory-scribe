
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Mail, Info, User, LogOut, DollarSign } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface MainMenuProps {
  orientation?: "horizontal" | "vertical";
  onItemClick?: () => void;
}

const MainMenu = ({ orientation = "horizontal", onItemClick }: MainMenuProps) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleItemClick = (callback?: () => Promise<void> | void) => {
    return async () => {
      if (callback) {
        await callback();
      }
      if (onItemClick) {
        onItemClick();
      }
    };
  };

  // For vertical orientation (mobile menu)
  if (orientation === "vertical") {
    return (
      <div className="flex flex-col space-y-2">
        <Button variant="ghost" asChild className="justify-start" onClick={handleItemClick()}>
          <Link to="/pricing" className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4" />
            <span>Pricing</span>
          </Link>
        </Button>
        <Button variant="ghost" asChild className="justify-start" onClick={handleItemClick()}>
          <Link to="/contact" className="flex items-center">
            <Mail className="mr-2 h-4 w-4" />
            <span>Contact Us</span>
          </Link>
        </Button>
        <Button variant="ghost" asChild className="justify-start" onClick={handleItemClick()}>
          <Link to="/about" className="flex items-center">
            <Info className="mr-2 h-4 w-4" />
            <span>About</span>
          </Link>
        </Button>
        
        {user && (
          <>
            <Button variant="ghost" asChild className="justify-start" onClick={handleItemClick()}>
              <Link to="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              className="justify-start text-red-500 flex items-center"
              onClick={handleItemClick(handleSignOut)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </>
        )}
      </div>
    );
  }

  // Default horizontal orientation (dropdown)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild onClick={handleItemClick()}>
          <Link to="/pricing" className="flex items-center cursor-pointer">
            <DollarSign className="mr-2 h-4 w-4" />
            <span>Pricing</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild onClick={handleItemClick()}>
          <Link to="/contact" className="flex items-center cursor-pointer">
            <Mail className="mr-2 h-4 w-4" />
            <span>Contact Us</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild onClick={handleItemClick()}>
          <Link to="/about" className="flex items-center cursor-pointer">
            <Info className="mr-2 h-4 w-4" />
            <span>About</span>
          </Link>
        </DropdownMenuItem>
        
        {user && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild onClick={handleItemClick()}>
              <Link to="/profile" className="flex items-center cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleItemClick(handleSignOut)}
              className="flex items-center cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MainMenu;
