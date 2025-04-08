
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LogOut, 
  BarChart, 
  PieChart, 
  Home, 
  PlusCircle, 
  Settings 
} from "lucide-react";
import { toast } from "sonner";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };
  
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Transactions", path: "/transactions", icon: PlusCircle },
    { name: "Budgets", path: "/budgets", icon: PieChart },
    { name: "Reports", path: "/reports", icon: BarChart },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-10">
      <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-budget-green-800 to-budget-green-900">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-budget-green-900">
          <h1 className="text-xl font-bold text-white">BudgetWise</h1>
        </div>
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left mb-1",
                  isActive(item.path) 
                    ? "bg-budget-green-700 text-white hover:bg-budget-green-700" 
                    : "text-gray-100 hover:bg-budget-green-700 hover:text-white"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Button>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-budget-green-700 p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-100 hover:bg-budget-green-700 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
