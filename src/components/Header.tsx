import { Plane, ChevronDown, Menu, User } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">wego</span>
            </div>
            <a href="#" className="text-white/90 hover:text-white text-sm hidden md:block">
              WegoPro Business Travel
            </a>
          </div>

          {/* Right side menu */}
          <div className="flex items-center space-x-6">
            {/* Country and Currency */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-white/90 hover:text-white cursor-pointer">
                <span className="text-sm">🇦🇪</span>
                <span className="text-sm">EN</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="text-white/90 hover:text-white cursor-pointer text-sm">
                AED
              </div>
            </div>

            {/* Menu items */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-white/90 hover:text-white text-sm">
                Support
              </a>
              <a href="#" className="text-white/90 hover:text-white text-sm">
                My Trips
              </a>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent"
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col space-y-4 pt-4">
              <a href="#" className="text-white/90 hover:text-white text-sm">
                WegoPro Business Travel
              </a>
              <a href="#" className="text-white/90 hover:text-white text-sm">
                Support
              </a>
              <a href="#" className="text-white/90 hover:text-white text-sm">
                My Trips
              </a>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-white/90">
                  <span className="text-sm">🇦🇪 EN</span>
                </div>
                <div className="text-white/90 text-sm">AED</div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-white/30 text-white hover:bg-white/10 bg-transparent w-fit"
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;