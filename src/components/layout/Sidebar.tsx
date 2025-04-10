
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LogOut, 
  BarChart, 
  PieChart, 
  Home, 
  PlusCircle, 
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Transactions", path: "/transactions", icon: PlusCircle },
    { name: "Budgets", path: "/budgets", icon: PieChart },
    { name: "Reports", path: "/reports", icon: BarChart },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar}
          className="bg-budget-green-800 text-white hover:bg-budget-green-700 transition-colors duration-300"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      {/* Sidebar for mobile and desktop */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex-col bg-gradient-to-b from-budget-green-800 to-budget-green-900 transition-all duration-300 ease-in-out",
          "md:flex",
          isOpen ? "w-64" : "w-16",
          isMobile && !isOpen && "-translate-x-full",
          isMobile && isOpen && "w-64 translate-x-0"
        )}
      >
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-budget-green-900 justify-between">
          <h1 className={cn(
            "font-bold text-white transition-opacity duration-300",
            isOpen ? "text-xl opacity-100" : "text-xl opacity-0 md:hidden"
          )}>
            BudgetWise
          </h1>
          
          {/* Toggle button for desktop */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="hidden md:flex text-white hover:bg-budget-green-700 transition-colors duration-300"
          >
            {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left mb-1 transition-all duration-300",
                  isActive(item.path) 
                    ? "bg-budget-green-700 text-white hover:bg-budget-green-700" 
                    : "text-gray-100 hover:bg-budget-green-700 hover:text-white",
                  !isOpen && "px-2"
                )}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setIsOpen(false);
                }}
              >
                <item.icon className={cn("h-5 w-5", isOpen ? "mr-3" : "mx-auto")} />
                {isOpen && <span className="animate-fadeIn">{item.name}</span>}
              </Button>
            ))}
          </nav>
        </div>
        
        <div className="flex-shrink-0 flex border-t border-budget-green-700 p-4">
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start text-gray-100 hover:bg-budget-green-700 hover:text-white transition-all duration-300",
              !isOpen && "px-2"
            )}
            onClick={handleLogout}
          >
            <LogOut className={cn("h-5 w-5", isOpen ? "mr-3" : "mx-auto")} />
            {isOpen && <span className="animate-fadeIn">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Content margin adjustment */}
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out",
          isOpen && !isMobile ? "md:ml-64" : "md:ml-16"
        )}
      />
    </>
  );
}
