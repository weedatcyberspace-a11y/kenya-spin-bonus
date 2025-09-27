import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Coins, Sparkles } from "lucide-react";

interface RegistrationProps {
  onRegister: (userData: { name: string; phone: string }) => void;
}

export const Registration = ({ onRegister }: RegistrationProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate registration delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Welcome Bonus!",
      description: "KSH 500 added to your account!",
      className: "bg-gradient-primary border-primary",
    });
    
    onRegister({ name: name.trim(), phone: phone.trim() });
    setIsLoading(false);
  };

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
            Join Casino
          </CardTitle>
          <div className="flex items-center justify-center gap-2 text-success">
            <Sparkles className="w-5 h-5" />
            <span className="text-lg font-semibold">KSH 500 Welcome Bonus</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold text-lg transition-all duration-300 hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                "Join & Get KSH 500"
              )}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center">
            By joining, you agree to our terms and conditions
          </p>
        </CardContent>
      </Card>
    </div>
  );
};