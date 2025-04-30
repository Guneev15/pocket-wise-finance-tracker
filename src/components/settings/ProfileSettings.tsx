import { useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/services/auth";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

export function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Load user data
  useState(() => {
    const loadUserData = async () => {
      try {
        const user = await auth.getCurrentUser();
        if (user) {
          profileForm.reset({
            name: user.name,
            email: user.email,
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user data");
      }
    };
    loadUserData();
  }, []);

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsLoading(true);
    setProfileError("");
    
    try {
      // In a real app, this would be an API call
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const session = JSON.parse(localStorage.getItem("session") || "{}");
      const userIndex = users.findIndex((u: any) => u.id === session.userId);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        name: values.name,
        email: values.email.toLowerCase(),
      };
      
      // Update session
      session.name = values.name;
      session.email = values.email.toLowerCase();
      
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("session", JSON.stringify(session));
      localStorage.setItem("user", JSON.stringify({
        id: session.userId,
        name: values.name,
        email: values.email.toLowerCase(),
      }));
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error);
      setProfileError(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    setIsLoading(true);
    setPasswordError("");
    
    try {
      await auth.changePassword(values.currentPassword, values.newPassword);
      toast.success("Password updated successfully!");
      passwordForm.reset();
    } catch (error: any) {
      console.error("Password update error:", error);
      setPasswordError(error.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {profileError && (
                <p className="text-sm text-red-500">{profileError}</p>
              )}
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </Form>
          
          <Separator className="my-6" />
          
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <h3 className="text-lg font-medium">Change Password</h3>
              
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
