import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Plane, Menu, User 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { User as UserType } from "@shared/schema";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  
  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/user"],
  });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Plane className="text-primary-dark" />
            <span className="font-poppins font-bold text-xl text-primary-dark">Wejhatii</span>
          </div>
          
          <nav className="hidden md:flex space-x-6 font-medium">
            <Link href="/" className={`${isActive("/") ? "text-primary" : "text-gray-600"} hover:text-primary transition`}>
              Home
            </Link>
            <Link href="/explore" className={`${isActive("/explore") ? "text-primary" : "text-gray-600"} hover:text-primary transition`}>
              Explore
            </Link>
            {user && (
              <Link href="/saved-trips" className={`${isActive("/saved-trips") ? "text-primary" : "text-gray-600"} hover:text-primary transition`}>
                Saved Trips
              </Link>
            )}
            {user && (
              <Link href="/profile" className={`${isActive("/profile") ? "text-primary" : "text-gray-600"} hover:text-primary transition`}>
                Profile
              </Link>
            )}
          </nav>
          
          <div className="flex items-center space-x-3">
            {user ? (
              <Button asChild variant="outline" size="sm" className="hidden md:flex items-center">
                <Link href="/profile">
                  <User className="h-4 w-4 mr-2" />
                  <span>{user.fullName}</span>
                </Link>
              </Button>
            ) : (
              <Button asChild className="hidden md:block">
                <Link href="/login">Sign In</Link>
              </Button>
            )}
            
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
              <Menu className="h-6 w-6 text-gray-700" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className={`${isActive("/") ? "text-primary" : "text-gray-600"} hover:text-primary transition py-2`}>
                Home
              </Link>
              <Link href="/explore" className={`${isActive("/explore") ? "text-primary" : "text-gray-600"} hover:text-primary transition py-2`}>
                Explore
              </Link>
              {user ? (
                <>
                  <Link href="/saved-trips" className={`${isActive("/saved-trips") ? "text-primary" : "text-gray-600"} hover:text-primary transition py-2`}>
                    Saved Trips
                  </Link>
                  <Link href="/profile" className={`${isActive("/profile") ? "text-primary" : "text-gray-600"} hover:text-primary transition py-2`}>
                    Profile
                  </Link>
                </>
              ) : (
                <Link href="/login" className="bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-dark transition text-center">
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
