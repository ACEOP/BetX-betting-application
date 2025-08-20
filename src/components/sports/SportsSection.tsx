import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlayCircle, Clock, TrendingUp, TrendingDown, Pause, Calculator, Target } from "lucide-react";

interface Match {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'live' | 'upcoming' | 'finished' | 'suspended';
  time: string;
  odds: {
    home: number;
    draw?: number;
    away: number;
  };
  sessionBets?: {
    runs: number;
    wickets: number;
    overs: number;
  };
  playerBets?: {
    topScorer: { name: string; odds: number }[];
    mostWickets: { name: string; odds: number }[];
  };
  suspended?: boolean;
  suspensionReason?: string;
}

interface BetSlip {
  matchId: string;
  type: string;
  odds: number;
  stake: number;
  potentialWin: number;
}

const mockMatches: Match[] = [
  {
    id: '1',
    sport: 'Cricket',
    homeTeam: 'Mumbai Indians',
    awayTeam: 'Chennai Super Kings',
    homeScore: 156,
    awayScore: 89,
    status: 'live',
    time: '15.2 overs',
    odds: { home: 2.45, away: 1.65 },
    sessionBets: { runs: 45, wickets: 3, overs: 5 },
    playerBets: {
      topScorer: [
        { name: 'Rohit Sharma', odds: 3.2 },
        { name: 'MS Dhoni', odds: 4.1 }
      ],
      mostWickets: [
        { name: 'Jasprit Bumrah', odds: 2.8 },
        { name: 'Ravindra Jadeja', odds: 3.5 }
      ]
    }
  },
  {
    id: '2',
    sport: 'Football',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    homeScore: 1,
    awayScore: 2,
    status: 'suspended',
    time: '67\'',
    odds: { home: 2.45, draw: 3.20, away: 1.85 },
    suspended: true,
    suspensionReason: 'VAR Review in Progress'
  },
  {
    id: '3',
    sport: 'Tennis',
    homeTeam: 'Novak Djokovic',
    awayTeam: 'Rafael Nadal',
    status: 'upcoming',
    time: '15:30',
    odds: { home: 1.65, away: 2.30 }
  }
];

export const SportsSection = () => {
  const [matches, setMatches] = useState(mockMatches);
  const [betSlip, setBetSlip] = useState<BetSlip[]>([]);
  const [cashOutDialogOpen, setCashOutDialogOpen] = useState(false);
  const [selectedCashOut, setSelectedCashOut] = useState<BetSlip | null>(null);

  // Simulate live odds changes and suspensions
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prev => prev.map(match => {
        // Random suspension for live matches
        if (match.status === 'live' && Math.random() < 0.1) {
          return {
            ...match,
            status: 'suspended' as const,
            suspended: true,
            suspensionReason: 'Major Event - Betting Suspended'
          };
        }
        
        // Resume suspended matches
        if (match.status === 'suspended' && Math.random() < 0.3) {
          return {
            ...match,
            status: 'live' as const,
            suspended: false,
            suspensionReason: undefined
          };
        }

        // Update odds for non-suspended matches
        if (match.status === 'live' && !match.suspended) {
          return {
            ...match,
            odds: {
              ...match.odds,
              home: Number((match.odds.home + (Math.random() - 0.5) * 0.15).toFixed(2)),
              away: Number((match.odds.away + (Math.random() - 0.5) * 0.15).toFixed(2)),
              ...(match.odds.draw && { draw: Number((match.odds.draw + (Math.random() - 0.5) * 0.15).toFixed(2)) })
            }
          };
        }
        
        return match;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const addToBetSlip = (matchId: string, type: string, odds: number) => {
    const newBet: BetSlip = {
      matchId,
      type,
      odds,
      stake: 0,
      potentialWin: 0
    };
    setBetSlip(prev => [...prev, newBet]);
  };

  const updateBetStake = (index: number, stake: number) => {
    setBetSlip(prev => prev.map((bet, i) => 
      i === index 
        ? { ...bet, stake, potentialWin: stake * bet.odds }
        : bet
    ));
  };

  const removeBet = (index: number) => {
    setBetSlip(prev => prev.filter((_, i) => i !== index));
  };

  const handleCashOut = (bet: BetSlip) => {
    setSelectedCashOut(bet);
    setCashOutDialogOpen(true);
  };

  const confirmCashOut = () => {
    if (selectedCashOut) {
      const cashOutValue = selectedCashOut.potentialWin * 0.8; // 80% of potential win
      console.log(`Cash out: ₹${cashOutValue.toFixed(2)}`);
      setCashOutDialogOpen(false);
      setSelectedCashOut(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Live Sports</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="animate-pulse">
            <PlayCircle className="w-3 h-3 mr-1" />
            Live
          </Badge>
          <Badge variant="outline">
            {matches.filter(m => m.status === 'live').length} Live Matches
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {matches.map((match) => (
          <Card key={match.id} className={`p-6 transition-all duration-300 ${
            match.suspended 
              ? 'bg-warning/10 border-warning/50' 
              : 'bg-gradient-card border-border/50 hover:shadow-hover'
          }`}>
            {/* Suspension Notice */}
            {match.suspended && (
              <div className="mb-4 p-3 bg-warning/20 border border-warning/30 rounded-lg flex items-center space-x-2">
                <Pause className="w-4 h-4 text-warning" />
                <span className="text-warning font-medium">
                  Betting Suspended: {match.suspensionReason}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              {/* Match Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline">{match.sport}</Badge>
                  {match.status === 'live' && !match.suspended && (
                    <Badge variant="destructive" className="animate-pulse">
                      <Clock className="w-3 h-3 mr-1" />
                      {match.time}
                    </Badge>
                  )}
                  {match.status === 'upcoming' && (
                    <Badge variant="secondary">
                      {match.time}
                    </Badge>
                  )}
                  {match.suspended && (
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning">
                      Suspended
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{match.homeTeam}</span>
                    {match.homeScore !== undefined && (
                      <span className="text-2xl font-bold">{match.homeScore}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{match.awayTeam}</span>
                    {match.awayScore !== undefined && (
                      <span className="text-2xl font-bold">{match.awayScore}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Betting Odds */}
              <div className="flex space-x-2 ml-6">
                <Button
                  variant="outline"
                  disabled={match.suspended}
                  className="flex flex-col p-3 h-auto min-w-[80px] hover:bg-primary/10 hover:border-primary transition-all disabled:opacity-50"
                  onClick={() => addToBetSlip(match.id, 'home', match.odds.home)}
                >
                  <span className="text-xs opacity-70">{match.homeTeam.split(' ')[0]}</span>
                  <span className="font-bold text-primary">{match.odds.home}</span>
                  <TrendingUp className="w-3 h-3 text-success mt-1" />
                </Button>
                
                {match.odds.draw && (
                  <Button
                    variant="outline"
                    disabled={match.suspended}
                    className="flex flex-col p-3 h-auto min-w-[80px] hover:bg-warning/10 hover:border-warning transition-all disabled:opacity-50"
                    onClick={() => addToBetSlip(match.id, 'draw', match.odds.draw)}
                  >
                    <span className="text-xs opacity-70">Draw</span>
                    <span className="font-bold text-warning">{match.odds.draw}</span>
                    <TrendingDown className="w-3 h-3 text-warning mt-1" />
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  disabled={match.suspended}
                  className="flex flex-col p-3 h-auto min-w-[80px] hover:bg-destructive/10 hover:border-destructive transition-all disabled:opacity-50"
                  onClick={() => addToBetSlip(match.id, 'away', match.odds.away)}
                >
                  <span className="text-xs opacity-70">{match.awayTeam.split(' ')[0]}</span>
                  <span className="font-bold text-destructive">{match.odds.away}</span>
                  <TrendingDown className="w-3 h-3 text-destructive mt-1" />
                </Button>
              </div>
            </div>

            {/* Additional Betting Markets */}
            {match.sport === 'Cricket' && match.sessionBets && (
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="font-medium mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Session Betting
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={match.suspended}
                    onClick={() => addToBetSlip(match.id, 'session-runs', 2.1)}
                  >
                    Runs: {match.sessionBets.runs}+ @2.1
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={match.suspended}
                    onClick={() => addToBetSlip(match.id, 'session-wickets', 1.9)}
                  >
                    Wickets: {match.sessionBets.wickets}+ @1.9
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={match.suspended}
                    onClick={() => addToBetSlip(match.id, 'session-overs', 1.8)}
                  >
                    Overs: {match.sessionBets.overs}+ @1.8
                  </Button>
                </div>
              </div>
            )}

            {/* Player Performance Betting */}
            {match.playerBets && (
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="font-medium mb-2">Player Performance</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Top Scorer</p>
                    <div className="space-y-1">
                      {match.playerBets.topScorer.map((player, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          disabled={match.suspended}
                          className="w-full justify-between"
                          onClick={() => addToBetSlip(match.id, `top-scorer-${player.name}`, player.odds)}
                        >
                          <span className="text-xs">{player.name}</span>
                          <span className="font-bold">{player.odds}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Most Wickets</p>
                    <div className="space-y-1">
                      {match.playerBets.mostWickets.map((player, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          disabled={match.suspended}
                          className="w-full justify-between"
                          onClick={() => addToBetSlip(match.id, `most-wickets-${player.name}`, player.odds)}
                        >
                          <span className="text-xs">{player.name}</span>
                          <span className="font-bold">{player.odds}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Enhanced Bet Slip */}
      {betSlip.length > 0 && (
        <Card className="fixed bottom-4 right-4 p-4 bg-gradient-primary shadow-glow border-0 min-w-[350px] max-w-[400px]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-primary-foreground flex items-center">
                <Calculator className="w-4 h-4 mr-2" />
                Bet Slip ({betSlip.length})
              </h3>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setBetSlip([])}
              >
                Clear All
              </Button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {betSlip.map((bet, index) => (
                <div key={index} className="bg-primary-foreground/10 p-3 rounded space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="text-primary-foreground/90 text-sm">
                      {bet.type} @ {bet.odds}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeBet(index)}
                      className="h-auto p-1 text-primary-foreground/70 hover:text-primary-foreground"
                    >
                      ✕
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Stake"
                        value={bet.stake || ''}
                        onChange={(e) => updateBetStake(index, Number(e.target.value))}
                        className="bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50"
                      />
                    </div>
                    <div className="text-primary-foreground/90 text-sm self-center">
                      Win: ₹{bet.potentialWin.toFixed(2)}
                    </div>
                  </div>
                  {bet.stake > 0 && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleCashOut(bet)}
                    >
                      Cash Out (₹{(bet.potentialWin * 0.8).toFixed(2)})
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-primary-foreground/20">
              <div className="flex justify-between text-primary-foreground mb-2">
                <span>Total Stake:</span>
                <span>₹{betSlip.reduce((sum, bet) => sum + bet.stake, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-primary-foreground mb-3">
                <span>Potential Win:</span>
                <span>₹{betSlip.reduce((sum, bet) => sum + bet.potentialWin, 0).toFixed(2)}</span>
              </div>
              <Button 
                variant="secondary" 
                className="w-full"
                disabled={betSlip.some(bet => bet.stake === 0)}
              >
                Place All Bets
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Cash Out Dialog */}
      <Dialog open={cashOutDialogOpen} onOpenChange={setCashOutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cash Out Confirmation</DialogTitle>
          </DialogHeader>
          {selectedCashOut && (
            <div className="space-y-4">
              <div className="bg-secondary/20 p-4 rounded">
                <h4 className="font-medium">{selectedCashOut.type}</h4>
                <p className="text-sm text-muted-foreground">
                  Original Stake: ₹{selectedCashOut.stake}
                </p>
                <p className="text-sm text-muted-foreground">
                  Potential Win: ₹{selectedCashOut.potentialWin.toFixed(2)}
                </p>
              </div>
              <div className="bg-success/10 p-4 rounded border border-success/20">
                <h4 className="font-medium text-success">
                  Cash Out Value: ₹{(selectedCashOut.potentialWin * 0.8).toFixed(2)}
                </h4>
                <p className="text-sm text-success/80">
                  You will receive 80% of your potential winnings immediately.
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setCashOutDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmCashOut} className="flex-1">
                  Confirm Cash Out
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};