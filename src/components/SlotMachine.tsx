import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Play, Pause, Coins, Zap } from "lucide-react";

const SLOT_SYMBOLS = ['🍒', '🍋', '🍊', '🔔', '⭐', '💎', '7️⃣'];
const STAKE_OPTIONS = [10, 25, 50, 100, 200, 500]; // Available stake amounts

interface SlotMachineProps {
  balance: number;
  freeSpins: number;
  onResult: (winAmount: number, usedFreeSpins: number) => void;
  onBalanceChange: (balance: number) => void;
  onFreeSpinsChange: (freeSpins: number) => void;
}

export const SlotMachine = ({ 
  balance, 
  freeSpins, 
  onResult, 
  onBalanceChange, 
  onFreeSpinsChange 
}: SlotMachineProps) => {
  const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState(0);
  const [currentStake, setCurrentStake] = useState(50);
  const spinTimeoutRef = useRef<NodeJS.Timeout>();

  const calculateWin = (symbols: string[]) => {
    // Three of a kind
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
      switch (symbols[0]) {
        case '💎': return 500;
        case '7️⃣': return 300;
        case '⭐': return 200;
        case '🔔': return 150;
        case '🍊': return 100;
        case '🍋': return 75;
        case '🍒': return 50;
        default: return 25;
      }
    }
    
    // Two of a kind
    if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
      return 10;
    }
    
    return 0;
  };

  const spin = async () => {
    if (isSpinning) return;

    const usingFreeSpins = freeSpins > 0;
    
    if (!usingFreeSpins && balance < currentStake) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least KSH ${currentStake} to spin`,
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);
    setLastWin(0);

    // Deduct bet amount or free spin
    if (usingFreeSpins) {
      onFreeSpinsChange(freeSpins - 1);
    } else {
      onBalanceChange(balance - currentStake);
    }

    // Animate spinning
    const spinDuration = 2000;
    const intervals: NodeJS.Timeout[] = [];
    
    // Start spinning animation for each reel
    reels.forEach((_, index) => {
      const interval = setInterval(() => {
        setReels(prev => {
          const newReels = [...prev];
          newReels[index] = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
          return newReels;
        });
      }, 100);
      intervals.push(interval);
    });

    // Stop spinning after duration
    spinTimeoutRef.current = setTimeout(() => {
      intervals.forEach(clearInterval);
      
      // Generate final result
      const finalReels = Array.from({ length: 3 }, () => 
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]
      );
      
      setReels(finalReels);
      
      const winAmount = calculateWin(finalReels);
      setLastWin(winAmount);
      
      if (winAmount > 0) {
        toast({
          title: "🎉 Winner!",
          description: `You won KSH ${winAmount}!`,
          className: "bg-success/20 border-success text-success-foreground",
        });
      } else if (!usingFreeSpins) {
        toast({
          title: "Try Again!",
          description: "You got 3 free spins!",
          className: "bg-accent/20 border-accent text-accent-foreground",
        });
      }
      
      onResult(winAmount, usingFreeSpins ? 1 : 0);
      setIsSpinning(false);
    }, spinDuration);
  };

  return (
    <Card className="bg-gradient-card border-border shadow-2xl overflow-hidden">
      <CardHeader className="text-center bg-gradient-slot">
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          🎰 Slot Machine
        </CardTitle>
        <div className="flex items-center justify-center gap-4 text-muted-foreground">
          <span>Stake: KSH {currentStake}</span>
          {freeSpins > 0 && (
            <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
              <Zap className="w-3 h-3 mr-1" />
              {freeSpins} Free Spins
            </Badge>
          )}
        </div>
        
        {/* Stake Controls */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="text-sm text-muted-foreground">Stake:</span>
          {STAKE_OPTIONS.map((stake) => (
            <Button
              key={stake}
              size="sm"
              variant={currentStake === stake ? "default" : "outline"}
              onClick={() => setCurrentStake(stake)}
              className="h-8 px-3 text-xs"
            >
              KSH {stake}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-8">
        {/* Slot Reels */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-4 mb-6">
            {reels.map((symbol, index) => (
              <div
                key={index}
                className={`
                  w-20 h-20 bg-gradient-slot border-2 border-primary/30 rounded-lg 
                  flex items-center justify-center text-4xl font-bold
                  ${isSpinning ? 'animate-slot-spin' : 'animate-bounce-in'}
                  shadow-lg
                `}
              >
                {symbol}
              </div>
            ))}
          </div>

          {/* Win Display */}
          {lastWin > 0 && (
            <div className="text-center animate-bounce-in">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary rounded-full text-primary-foreground font-bold text-xl shadow-lg">
                <Coins className="w-6 h-6" />
                KSH {lastWin}
              </div>
            </div>
          )}
        </div>

        {/* Spin Button */}
        <div className="flex justify-center">
          <Button
            onClick={spin}
            disabled={isSpinning || (!freeSpins && balance < currentStake)}
            className={`
              w-32 h-32 rounded-full text-xl font-bold shadow-2xl transition-all duration-300
              ${isSpinning 
                ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                : freeSpins > 0 
                  ? 'bg-gradient-to-br from-accent to-accent/80 hover:scale-110 text-accent-foreground animate-glow-pulse'
                  : 'bg-gradient-primary hover:scale-110 text-primary-foreground animate-glow-pulse'
              }
            `}
          >
            {isSpinning ? (
              <div className="flex flex-col items-center">
                <Pause className="w-8 h-8 mb-1" />
                <span className="text-sm">Spinning...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Play className="w-8 h-8 mb-1" />
                <span className="text-sm">
                  {freeSpins > 0 ? 'Free Spin' : 'Spin'}
                </span>
              </div>
            )}
          </Button>
        </div>

        {/* Paytable */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-4">Paytable</h3>
          <div className="grid grid-cols-2 gap-2 text-sm max-w-md mx-auto">
            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
              <span>💎💎💎</span>
              <span className="text-primary font-semibold">KSH 500</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
              <span>7️⃣7️⃣7️⃣</span>
              <span className="text-primary font-semibold">KSH 300</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
              <span>⭐⭐⭐</span>
              <span className="text-primary font-semibold">KSH 200</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
              <span>Any 2 Match</span>
              <span className="text-primary font-semibold">KSH 10</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};