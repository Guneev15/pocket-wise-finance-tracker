
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    // Check if email ends with @gmail.com
    return email.toLowerCase().endsWith('@gmail.com');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error("Please use a valid Gmail account (@gmail.com)");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get existing users or initialize empty array
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if email already exists
      if (existingUsers.some((user: any) => user.email === email)) {
        toast.error("An account with this email already exists");
        setIsLoading(false);
        return;
      }
      
      // Create new user with empty financial data
      const newUser = { 
        id: Date.now().toString(), 
        name, 
        email, 
        password,
        transactions: [],
        budgets: [],
        categories: [
          { id: "cat1", name: "Housing", icon: "home", color: "#4CAF50" },
          { id: "cat2", name: "Food", icon: "utensils", color: "#2196F3" },
          { id: "cat3", name: "Transportation", icon: "car", color: "#FF9800" },
          { id: "cat4", name: "Entertainment", icon: "film", color: "#9C27B0" },
          { id: "cat5", name: "Utilities", icon: "zap", color: "#607D8B" },
          { id: "cat6", name: "Shopping", icon: "shopping-bag", color: "#E91E63" },
          { id: "cat7", name: "Healthcare", icon: "activity", color: "#00BCD4" },
          { id: "cat8", name: "Personal", icon: "user", color: "#795548" }
        ],
        balance: 0,
        income: 0,
        expenses: 0
      };
      
      setTimeout(() => {
        // Save to users array
        existingUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(existingUsers));
        
        // Set as current user
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify({ 
          id: newUser.id, 
          name, 
          email 
        }));
        
        toast.success("Account created successfully!");
        navigate("/dashboard");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fadeIn">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          <a onClick={() => navigate('/')} className="cursor-pointer hover:text-budget-green-700 transition-colors">BudgetWise</a>
        </CardTitle>
        <CardDescription className="text-center">Enter your details to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="transition-all duration-300 focus:ring-2 focus:ring-budget-green-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your Gmail address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="transition-all duration-300 focus:ring-2 focus:ring-budget-green-500"
            />
            {email && !validateEmail(email) && (
              <p className="text-xs text-red-500 mt-1 animate-fadeIn">Please use a Gmail account (@gmail.com)</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="transition-all duration-300 focus:ring-2 focus:ring-budget-green-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="transition-all duration-300 focus:ring-2 focus:ring-budget-green-500"
            />
          </div>
          <Button type="submit" className="w-full transition-all duration-300 hover:scale-[1.02]" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Button variant="link" className="p-0 hover:text-budget-green-700" onClick={() => navigate("/login")}>
            Log in
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
