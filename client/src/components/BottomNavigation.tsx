import { Link, useLocation } from "wouter";
import { Coffee, Menu, MapPin, Clock, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: "/", label: "Home", icon: Coffee },
    { path: "/menu", label: "Menu", icon: Menu },
    { path: "/locations", label: "Locations", icon: MapPin },
    { path: "/orders", label: "Orders", icon: Clock },
    { path: "/contact", label: "Contact", icon: UserCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-border z-40">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={cn(
              "flex flex-col items-center py-2 px-4",
              isActive(item.path) 
                ? "text-primary" 
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            <item.icon className="text-xl h-5 w-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
