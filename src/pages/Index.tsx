
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
export default function Index() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);
  return <div className="bg-gradient-to-br from-budget-green-800 to-budget-green-900 min-h-screen flex flex-col">
      <header className="px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white">BudgetWise</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" className="text-white hover:bg-budget-green-700" onClick={() => navigate("/login")}>
            Log in
          </Button>
          <Button className="bg-white text-budget-green-800 hover:bg-gray-100" onClick={() => navigate("/signup")}>
            Sign up
          </Button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Take Control of Your Finances
          </h1>
          <p className="text-xl text-budget-green-100 mb-8">
            BudgetWise helps you track expenses, set budgets, and achieve your financial goals with powerful insights and easy-to-use tools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="bg-white text-budget-green-800 hover:bg-gray-100" onClick={() => navigate("/signup")}>
              Get Started — It's Free
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-budget-green-700" onClick={() => document.getElementById('features')?.scrollIntoView({
            behavior: 'smooth'
          })}>
              Learn More
            </Button>
          </div>
        </div>
      </main>
      
      <div id="features" className="px-4 py-12 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose BudgetWise?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our personal budget management system makes it easy to take control of your finances.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-budget-green-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-budget-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-budget-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Track Expenses</h3>
              <p className="text-gray-600">
                Easily log and categorize your income and expenses to keep track of where your money is going.
              </p>
            </div>
            
            <div className="bg-budget-green-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-budget-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-budget-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Set Budgets</h3>
              <p className="text-gray-600">
                Create custom budgets for different categories and receive alerts when you're close to exceeding them.
              </p>
            </div>
            
            <div className="bg-budget-green-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-budget-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-budget-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visualize Progress</h3>
              <p className="text-gray-600">
                View detailed reports and beautiful charts to understand your spending habits and financial trends.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="px-4 py-12 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold text-gray-900">BudgetWise</h2>
            <p className="text-gray-600 mt-2">© 2023 BudgetWise. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">Terms</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>;
}
