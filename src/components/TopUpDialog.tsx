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

  // Remove the demo handleTopUp function as it's no longer needed

  const handlePesaPalPayment = () => {
    // Open PesaPal payment page
    window.open('https://store.pesapal.com/moneyflow', '_blank');
    
    toast({
      title: "Redirecting to PesaPal",
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
          {/* PesaPal Integration Notice */}
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <div className="flex items-start gap-2">
              <ExternalLink className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-primary">Secure Payment via PesaPal</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your payment is processed securely through PesaPal's payment gateway.
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

          {/* PesaPal Payment Integration */}
          <div className="space-y-3">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <iframe 
                width="100%" 
                height="60" 
                src="https://store.pesapal.com/embed-code?pageUrl=https://store.pesapal.com/moneyflow" 
                frameBorder="0" 
                allowFullScreen
                className="rounded-md"
              ></iframe>
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
                onClick={handlePesaPalPayment}
                disabled={!amount || parseInt(amount) < 100}
                className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Pay with PesaPal
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};