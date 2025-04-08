
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, Menu, Home, PlusCircle, PieChart, BarChart, Settings } from "lucide-react";
import { toast } from "sonner";

export function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
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
    <header className="bg-white shadow-sm z-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px] bg-gradient-to-b from-budget-green-800 to-budget-green-900">
                <div className="py-6">
                  <div className="px-2 space-y-1">
                    {menuItems.map((item) => (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className="w-full justify-start text-gray-100 hover:bg-budget-green-700 hover:text-white"
                        onClick={() => {
                          navigate(item.path);
                          setIsOpen(false);
                        }}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-100 hover:bg-budget-green-700 hover:text-white"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex-1 flex items-center justify-center md:justify-end">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-budget-green-600 md:hidden">BudgetWise</h1>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
              <div className="text-sm font-medium text-gray-700 mr-4">
                Welcome, {user.name || "User"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
