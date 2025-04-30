import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { auth } from "@/services/auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    // More flexible email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (!password) {
      toast.error("Please enter your password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await auth.login(email, password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fadeIn">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          <a onClick={() => navigate('/')} className="cursor-pointer hover:text-budget-green-700 transition-colors">BudgetWise</a>
        </CardTitle>
        <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="transition-all duration-300 focus:ring-2 focus:ring-budget-green-500"
            />
            {email && !validateEmail(email) && (
              <p className="text-xs text-red-500 mt-1 animate-fadeIn">Please enter a valid email address</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button variant="link" size="sm" className="p-0 h-auto font-normal hover:text-budget-green-700">
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="transition-all duration-300 focus:ring-2 focus:ring-budget-green-500"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Button variant="link" className="p-0 hover:text-budget-green-700" onClick={() => navigate("/signup")}>
            Sign up
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
