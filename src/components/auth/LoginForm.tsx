
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    // Check if email ends with @gmail.com
    return email.toLowerCase().endsWith('@gmail.com');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleResetEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetEmail(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Gmail address
    if (!validateEmail(email)) {
      toast.error("Please use a valid Gmail account (@gmail.com)");
      return;
    }

    setIsLoading(true);
    
    // Check for credentials in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    setTimeout(() => {
      if (user || (email === "demo@gmail.com" && password === "password")) {
        // Store authentication state
        localStorage.setItem("isLoggedIn", "true");
        
        // If demo account, create a standard user object
        if (email === "demo@gmail.com" && password === "password") {
          localStorage.setItem("user", JSON.stringify({ 
            id: "demo1", 
            name: "Demo User", 
            email: "demo@gmail.com" 
          }));
        } else {
          localStorage.setItem("user", JSON.stringify(user));
        }
        
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid credentials. Please check your email and password.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Gmail address for reset
    if (!validateEmail(resetEmail)) {
      toast.error("Please use a valid Gmail account (@gmail.com)");
      return;
    }
    
    setIsResetting(true);
    
    // In a real app, this would be an API call to send reset email
    setTimeout(() => {
      toast.success(`Password reset link sent to ${resetEmail}`);
      setIsResetting(false);
      setResetDialogOpen(false);
      setResetEmail("");
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          <a onClick={() => navigate('/')} className="cursor-pointer">BudgetWise</a>
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
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" className="p-0 h-auto text-sm font-normal text-primary">
                    Forgot password?
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Reset password</DialogTitle>
                    <DialogDescription>
                      Enter your Gmail address and we'll send you a link to reset your password.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handlePasswordReset}>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="Enter your Gmail address"
                          value={resetEmail}
                          onChange={handleResetEmailChange}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isResetting}>
                        {isResetting ? "Sending..." : "Send reset link"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Button variant="link" className="p-0" onClick={() => navigate("/signup")}>
            Sign up
          </Button>
        </div>
        <div className="text-xs text-center text-muted-foreground">
          <strong>Demo Access:</strong> Email: demo@gmail.com / Password: password
        </div>
      </CardFooter>
    </Card>
  );
}
