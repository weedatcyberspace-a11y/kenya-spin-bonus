import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { CreditCard, ExternalLink, AlertCircle } from "lucide-react";

interface TopUpDialogProps {
  open: boolean;
  onClose: () => void;
  onTopUp: (amount: number) => void;
}

export const TopUpDialog = ({ open, onClose, onTopUp }: TopUpDialogProps) => {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTopUp = async () => {
    const topUpAmount = parseInt(amount);
    
    if (!amount || topUpAmount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum top-up is KSH 100",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // In a real app, this would redirect to PayHero
    // For demo purposes, we'll simulate the payment
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    onTopUp(topUpAmount);
    
    toast({
      title: "Top-up Successful!",
      description: `KSH ${topUpAmount} has been added to your account`,
      className: "bg-success/20 border-success text-success-foreground",
    });
    
    setAmount("");
    onClose();
    setIsProcessing(false);
  };

  const handlePayHeroRedirect = () => {
    // In a real implementation, this would redirect to PayHero with proper parameters
    window.open('https://app.payhero.co.ke/lipwa/3277', '_blank');
    
    toast({
      title: "Redirecting to PayHero",
      description: "Complete your payment to add funds to your account",
      className: "bg-primary/20 border-primary text-primary-foreground",
    });
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CreditCard className="w-5 h-5 text-primary" />
            Top Up Account
          </DialogTitle>
          <DialogDescription>
            Add funds to your casino account to continue playing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* PayHero Integration Notice */}
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <div className="flex items-start gap-2">
              <ExternalLink className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-primary">Secure Payment via PayHero</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your payment is processed securely through PayHero's payment gateway.
                </p>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="topup-amount">Top-up Amount</Label>
            <Input
              id="topup-amount"
              type="number"
              placeholder="Enter amount (min. KSH 100)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12 text-lg"
              min="100"
              disabled={isProcessing}
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label>Quick Select:</Label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  onClick={() => setAmount(amt.toString())}
                  className="h-10 border-primary/30 hover:bg-primary/10 hover:border-primary"
                  disabled={isProcessing}
                >
                  KSH {amt.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          {/* Demo vs Real Payment Options */}
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 bg-muted/20 border border-border rounded-lg">
              <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold">Demo Mode:</p>
                <p>This is a demonstration. Use "Demo Top-up" for testing or "PayHero Payment" for real transactions.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              
              <Button
                onClick={handleTopUp}
                disabled={isProcessing || !amount || parseInt(amount) < 100}
                className="flex-1 bg-gradient-secondary hover:opacity-90 text-secondary-foreground"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  "Demo Top-up"
                )}
              </Button>

              <Button
                onClick={handlePayHeroRedirect}
                disabled={!amount || parseInt(amount) < 100}
                className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                PayHero Payment
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};