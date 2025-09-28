import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Coins, Sparkles, LogIn, UserPlus } from "lucide-react";

interface RegistrationProps {
  onRegister: (userData: { name: string; phone: string }) => void;
}

export const Registration = ({ onRegister }: RegistrationProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Check if user exists in localStorage
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = storedUsers.find((u: any) => u.phone === phone.trim() && u.password === password);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      toast({
        title: "Login Successful!",
        description: "Welcome back to Royal Casino",
        className: "bg-gradient-primary border-primary",
      });
      onRegister({ name: user.name, phone: user.phone });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid phone number or password",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Check if user already exists
    const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userExists = storedUsers.some((u: any) => u.phone === phone.trim());
    
    if (userExists) {
      toast({
        title: "Error",
        description: "Phone number already registered. Please login instead.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Simulate realistic registration processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store user data
    const newUser = { name: name.trim(), phone: phone.trim(), password };
    storedUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
    
    toast({
      title: "Registration Successful!",
      description: "Welcome bonus of KSH 500 has been credited to your account",
      className: "bg-gradient-primary border-primary",
    });
    
    onRegister({ name: name.trim(), phone: phone.trim() });
    setIsLoading(false);
  };

  const handleSubmit = isLoginMode ? handleLogin : handleRegister;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-secondary opacity-10"></div>
      
      <Card className="w-full max-w-md bg-gradient-card border-border shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
        
        <CardHeader className="text-center space-y-4 relative z-10">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center animate-glow-pulse">
            <Coins className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Royal Casino
          </CardTitle>
          <div className="flex items-center justify-center gap-2 text-success">
            <Sparkles className="w-5 h-5" />
            <span className="text-lg font-semibold">KSH 500 Welcome Bonus</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          {/* Toggle buttons */}
          <div className="flex rounded-lg bg-muted p-1">
            <Button
              type="button"
              variant={!isLoginMode ? "default" : "ghost"}
              className={`flex-1 h-10 ${!isLoginMode ? 'bg-gradient-primary text-primary-foreground' : 'text-muted-foreground'}`}
              onClick={() => setIsLoginMode(false)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Register
            </Button>
            <Button
              type="button"
              variant={isLoginMode ? "default" : "ghost"}
              className={`flex-1 h-10 ${isLoginMode ? 'bg-gradient-primary text-primary-foreground' : 'text-muted-foreground'}`}
              onClick={() => setIsLoginMode(true)}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  disabled={isLoading}
                />
              </div>
            )}
            
            <div>
              <Input
                type="tel"
                placeholder="Phone Number (0712345678)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder={isLoginMode ? "Enter Password" : "Create Password (min 8 characters)"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
              />
            </div>

            {!isLoginMode && (
              <div>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  disabled={isLoading}
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold text-lg transition-all duration-300 hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  {isLoginMode ? "Logging in..." : "Processing Registration..."}
                </div>
              ) : (
                <>
                  {isLoginMode ? (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Login to Account
                    </>
                  ) : (
                    "Create Account & Get KSH 500"
                  )}
                </>
              )}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center">
            By {isLoginMode ? "logging in" : "joining"}, you agree to our terms and conditions
          </p>
        </CardContent>
      </Card>
    </div>
  );
};