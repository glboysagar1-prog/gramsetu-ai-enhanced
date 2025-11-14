import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSignup, setIsSignup] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiRequest<{ token: string; user: { id: string; email: string; username: string } }>(
        "POST",
        "/api/auth/login",
        data
      );
      return response;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userId", data.user.id);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: LoginFormData & { username?: string }) => {
      const username = data.email.split("@")[0];
      const response = await apiRequest<{ token: string; user: { id: string; email: string; username: string } }>(
        "POST",
        "/api/auth/signup",
        { ...data, username }
      );
      return response;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userId", data.user.id);
      toast({
        title: "Account created!",
        description: "Welcome to GramSetu AI.",
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.message || "Could not create account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    if (isSignup) {
      signupMutation.mutate(data);
    } else {
      loginMutation.mutate(data);
    }
  };

  const isPending = loginMutation.isPending || signupMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">
            {isSignup ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription>
            {isSignup 
              ? "Join thousands of users managing files efficiently" 
              : "Sign in to access your files and analytics"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        {...field}
                        data-testid="input-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={isSignup ? "Create a password (min 6 chars)" : "Enter your password"}
                        type="password"
                        {...field}
                        data-testid="input-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
                data-testid="button-submit"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSignup ? "Creating account..." : "Signing in..."}
                  </>
                ) : (
                  <>{isSignup ? "Sign Up" : "Sign In"}</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <Button
              variant="link"
              className="px-2"
              onClick={() => setIsSignup(!isSignup)}
              data-testid="button-toggle-mode"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground px-6">
            Trusted by 1000+ users for file management
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
