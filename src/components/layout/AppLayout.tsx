<<<<<<< HEAD
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { auth } from "@/services/auth";
=======
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { authService } from "@/services/auth";
>>>>>>> 16542632dbf75b11cc0620af2230220e66cd757a

export function AppLayout() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
<<<<<<< HEAD
    const checkAuth = async () => {
      try {
        const user = await auth.getCurrentUser();
        if (!user) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
=======
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate("/login");
    }
>>>>>>> 16542632dbf75b11cc0620af2230220e66cd757a
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-budget-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
