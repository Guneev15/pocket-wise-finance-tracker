
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return email.toLowerCase().endsWith('@gmail.com');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error("Please use a valid Gmail account (@gmail.com)");
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        // Get existing users
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find((u: any) => u.email === email && u.password === password);
        
        if (user) {
          // Set user as logged in
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email
          }));
          
          toast.success("Login successful!");
          navigate("/dashboard");
        } else {
          toast.error("Invalid email or password");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 1000);
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
          <Button type="submit" className="w-full transition-all duration-300 hover:scale-[1.02]" disabled={isLoading}>
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
