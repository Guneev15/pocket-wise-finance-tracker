
import { LoginForm } from "@/components/auth/LoginForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [isAnimated, setIsAnimated] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-budget-green-100 to-budget-green-200 p-4 sm:p-6 md:p-8">
      <div 
        className={`max-w-md w-full transition-all duration-700 ease-out ${
          isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold text-budget-green-900 cursor-pointer hover:text-budget-green-700 transition-colors duration-300 hover:scale-105 transform" 
            onClick={() => navigate("/")}
          >
            BudgetWise
          </h1>
          <p className="text-budget-green-800 mt-2 animate-fadeIn">Your personal finance manager</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
