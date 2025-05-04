import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, PlusCircle, PieChart, BarChart, Settings } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/auth";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading user:", error);
        toast.error("Failed to load user");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out");
    }
  };

  const menuItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Add Transaction", icon: PlusCircle, path: "/add" },
    { label: "Reports", icon: PieChart, path: "/reports" },
    { label: "Analytics", icon: BarChart, path: "/analytics" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <header>
      <div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
              <Button 
                variant="ghost" 
                onClick={handleLogout} 
                disabled={isLoading}
                className="w-full justify-start"
              >
                <span className="mr-2">🔒</span> Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
