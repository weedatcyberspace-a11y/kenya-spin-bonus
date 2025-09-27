import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SlotMachine } from "./SlotMachine";
import { WithdrawalDialog } from "./WithdrawalDialog";
import { TopUpDialog } from "./TopUpDialog";
import { toast } from "@/hooks/use-toast";
import { 
  Wallet, 
  TrendingUp, 
  Gift, 
  LogOut, 
  User,
  CreditCard,
  Coins,
  Share2,
  Shield,
  Star,
  Users,
  Copy,
  AlertTriangle
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
  const [referralEarnings, setReferralEarnings] = useState(0);
  
  const referralLink = "https://kenya-spin-bonus.vercel.app";
  
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link Copied!",
      description: "Referral link copied to clipboard",
      className: "bg-success/20 border-success",
    });
  };

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
        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-6 mb-6 p-4 bg-gradient-card rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-success" />
            <span className="text-sm text-muted-foreground">Secure & Licensed</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-warning" />
            <span className="text-sm text-muted-foreground">Trusted by 10,000+</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">24/7 Support</span>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <Card className="bg-gradient-card border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Referral Earnings</p>
                  <p className="text-2xl font-bold text-success">KSH {referralEarnings.toLocaleString()}</p>
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

        {/* Referral Section */}
        <Card className="bg-gradient-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Share2 className="w-5 h-5" />
              Refer Friends & Earn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">Share your referral link and earn KSH 2 for each friend who joins!</p>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-muted/30 rounded border border-border text-sm font-mono break-all">
                  {referralLink}
                </div>
                <Button onClick={copyReferralLink} variant="outline" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
                  Earn KSH 2 per referral
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Slot Machine */}
        <SlotMachine 
          balance={balance}
          freeSpins={freeSpins}
          onResult={handleSlotResult}
          onBalanceChange={setBalance}
          onFreeSpinsChange={setFreeSpins}
        />

        {/* Disclaimer */}
        <Card className="bg-gradient-card border-border shadow-lg border-warning/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-warning mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Important Disclaimer</h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• This is a casino game involving real money. Play responsibly.</p>
                  <p>• You must be 18+ years old to participate in gambling activities.</p>
                  <p>• Gambling can be addictive. Set limits and never bet more than you can afford to lose.</p>
                  <p>• Minimum withdrawal amount is KSH 599. Processing may take 1-3 business days.</p>
                  <p>• All transactions are secure and encrypted for your protection.</p>
                  <p>• For help with gambling addiction, contact Kenya's National Problem Gambling Helpline.</p>
                  <p>• By using this platform, you agree to our Terms of Service and Privacy Policy.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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