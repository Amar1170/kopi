import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Coffee, 
  Menu as MenuIcon,
  Search as SearchIcon,
  Sun, 
  Moon,
  X
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col space-y-4 py-4">
                <SheetClose asChild>
                  <Link href="/" className="flex items-center px-2 py-2 rounded-md hover:bg-secondary">
                    <Coffee className="mr-2 h-5 w-5 text-primary" />
                    <span className="font-medium">Home</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/menu" className="flex items-center px-2 py-2 rounded-md hover:bg-secondary">
                    <span className="font-medium">Menu</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/locations" className="flex items-center px-2 py-2 rounded-md hover:bg-secondary">
                    <span className="font-medium">Locations</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/orders" className="flex items-center px-2 py-2 rounded-md hover:bg-secondary">
                    <span className="font-medium">Order History</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/contact" className="flex items-center px-2 py-2 rounded-md hover:bg-secondary">
                    <span className="font-medium">Contact Us</span>
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link href="/">
            <div className="flex items-center space-x-2">
              <Coffee className="h-6 w-6 text-primary" />
              <h1 className="font-serif font-semibold text-xl text-primary">Coffee Haven</h1>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {isSearchOpen ? (
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Search..."
                className="w-full sm:w-40 md:w-60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-600 dark:text-gray-300"
            >
              <SearchIcon className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="text-gray-600 dark:text-gray-300"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
