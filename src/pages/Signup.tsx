
import { SignupForm } from "@/components/auth/SignupForm";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-budget-green-100 to-budget-green-200 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold text-budget-green-900 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            BudgetWise
          </h1>
          <p className="text-budget-green-800 mt-2">Create your account</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
