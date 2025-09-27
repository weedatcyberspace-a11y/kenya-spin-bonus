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
import { Banknote, AlertCircle } from "lucide-react";

interface WithdrawalDialogProps {
  open: boolean;
  onClose: () => void;
  balance: number;
  onWithdraw: (amount: number) => boolean;
}

export const WithdrawalDialog = ({ 
  open, 
  onClose, 
  balance, 
  onWithdraw 
}: WithdrawalDialogProps) => {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWithdraw = async () => {
    const withdrawAmount = parseInt(amount);
    
    if (!amount || withdrawAmount < 599) {
      toast({
        title: "Invalid Amount",
        description: "Minimum withdrawal is KSH 599",
        variant: "destructive",
      });
      return;
    }

    if (withdrawAmount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = onWithdraw(withdrawAmount);
    
    if (success) {
      toast({
        title: "Withdrawal Successful",
        description: `KSH ${withdrawAmount} has been processed for withdrawal`,
        className: "bg-success/20 border-success text-success-foreground",
      });
      setAmount("");
      onClose();
    }
    
    setIsProcessing(false);
  };

  const quickAmounts = [599, 1000, 2000, 5000].filter(amt => amt <= balance);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Banknote className="w-5 h-5 text-primary" />
            Withdraw Funds
          </DialogTitle>
          <DialogDescription>
            Enter the amount you want to withdraw. Minimum amount is KSH 599.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Balance Display */}
          <div className="p-4 bg-muted/20 rounded-lg border border-border">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Available Balance:</span>
              <span className="text-xl font-bold text-primary">
                KSH {balance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Withdrawal Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount (min. KSH 599)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12 text-lg"
              min="599"
              max={balance}
              disabled={isProcessing}
            />
          </div>

          {/* Quick Amount Buttons */}
          {quickAmounts.length > 0 && (
            <div className="space-y-2">
              <Label>Quick Select:</Label>
              <div className="grid grid-cols-2 gap-2">
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
          )}

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="text-sm text-destructive">
              <p className="font-semibold">Important:</p>
              <p>Withdrawals are processed within 24 hours. Minimum withdrawal amount is KSH 599.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={isProcessing || !amount || parseInt(amount) < 599}
              className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                "Withdraw"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};