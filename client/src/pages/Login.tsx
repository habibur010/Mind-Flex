import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Mail, Lock, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isLoggingIn } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const isFormValid = formData.email && formData.password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    try {
      await login(formData.email);
      toast({
        title: "Logged in successfully",
        description: "Welcome back!",
      });
      setLocation("/dashboard");
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Brain className="w-10 h-10 text-primary" />
            <span className="text-3xl font-bold font-display text-foreground">MindFlex</span>
          </Link>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            Welcome back! Let's get you focused.
          </p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2rem]">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-display">Log In</CardTitle>
            <CardDescription>Continue your journey to better focus</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Your user data will not be saved for security reasons, so you can fill in fake data.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 rounded-xl h-12"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 rounded-xl h-12"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    data-testid="input-password"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl text-base font-bold"
                disabled={!isFormValid || isLoggingIn}
                data-testid="button-login"
              >
                {isLoggingIn ? "Logging in..." : <>Log In <ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              New to MindFlex?{" "}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
