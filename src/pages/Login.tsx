
import { LoginForm } from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-budget-green-100 to-budget-green-200 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-budget-green-900">BudgetWise</h1>
          <p className="text-budget-green-800 mt-2">Your personal finance manager</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
