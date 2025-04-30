import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
<<<<<<< HEAD
import { auth } from "@/services/auth";
=======
import { authService } from "@/services/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
>>>>>>> 16542632dbf75b11cc0620af2230220e66cd757a

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
<<<<<<< HEAD
      await auth.login(email, password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
=======
      const result = await authService.login(email, password);
      if (result.success) {
        toast.success(result.message);
        navigate("/dashboard");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    
    // In a real app, this would be an API call to send reset email
    setTimeout(() => {
      toast.success(`Password reset link sent to ${resetEmail}`);
      setIsResetting(false);
      setResetDialogOpen(false);
      setResetEmail("");
    }, 1000);
>>>>>>> 16542632dbf75b11cc0620af2230220e66cd757a
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
<<<<<<< HEAD
              <Button variant="link" size="sm" className="p-0 h-auto font-normal hover:text-budget-green-700">
                Forgot password?
              </Button>
=======
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
                      Enter your email address and we'll send you a link to reset your password.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handlePasswordReset}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="Enter your email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isResetting}>
                        {isResetting ? "Sending..." : "Send Reset Link"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
>>>>>>> 16542632dbf75b11cc0620af2230220e66cd757a
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
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
<<<<<<< HEAD
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Button variant="link" className="p-0 hover:text-budget-green-700" onClick={() => navigate("/signup")}>
            Sign up
          </Button>
        </div>
=======
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/signup")}>
            Sign up
          </Button>
        </p>
>>>>>>> 16542632dbf75b11cc0620af2230220e66cd757a
      </CardFooter>
    </Card>
  );
}
