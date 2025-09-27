import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SlotMachine } from "./SlotMachine";
import { WithdrawalDialog } from "./WithdrawalDialog";
import { TopUpDialog } from "./TopUpDialog";
import { 
  Wallet, 
  TrendingUp, 
  Gift, 
  LogOut, 
  User,
  CreditCard,
  Coins
} from "lucide-react";

interface User {
  name: string;
  phone: string;
}

interface CasinoDashboardProps {
  user: User;
  onLogout: () => void;
}

export const CasinoDashboard = ({ user, onLogout }: CasinoDashboardProps) => {
  const [balance, setBalance] = useState(500); // KSH 500 welcome bonus
  const [freeSpins, setFreeSpins] = useState(0);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [totalWinnings, setTotalWinnings] = useState(0);

  const handleSlotResult = (winAmount: number, usedFreeSpins: number) => {
    if (winAmount > 0) {
      setBalance(prev => prev + winAmount);
      setTotalWinnings(prev => prev + winAmount);
    } else if (usedFreeSpins === 0) {
      // Lost and no free spins used, give 3 free spins
      setFreeSpins(3);
    }
  };

  const handleWithdraw = (amount: number) => {
    if (amount >= 599 && amount <= balance) {
      setBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  const handleTopUp = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Casino App</h1>
                <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="flex items-center gap-2 border-border hover:bg-muted"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-card border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="text-2xl font-bold text-primary">KSH {balance.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Winnings</p>
                  <p className="text-2xl font-bold text-success">KSH {totalWinnings.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Free Spins</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-accent">{freeSpins}</p>
                    {freeSpins > 0 && (
                      <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                        Available
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => setShowTopUp(true)}
            className="flex-1 h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Top Up Account
          </Button>
          
          <Button 
            onClick={() => setShowWithdrawal(true)}
            variant="outline"
            disabled={balance < 599}
            className="flex-1 h-12 border-primary text-primary hover:bg-primary/10"
          >
            <Wallet className="w-5 h-5 mr-2" />
            Withdraw {balance < 599 ? "(Min KSH 599)" : ""}
          </Button>
        </div>

        {/* Slot Machine */}
        <SlotMachine 
          balance={balance}
          freeSpins={freeSpins}
          onResult={handleSlotResult}
          onBalanceChange={setBalance}
          onFreeSpinsChange={setFreeSpins}
        />
      </div>

      {/* Dialogs */}
      <WithdrawalDialog 
        open={showWithdrawal}
        onClose={() => setShowWithdrawal(false)}
        balance={balance}
        onWithdraw={handleWithdraw}
      />
      
      <TopUpDialog 
        open={showTopUp}
        onClose={() => setShowTopUp(false)}
        onTopUp={handleTopUp}
      />
    </div>
  );
};