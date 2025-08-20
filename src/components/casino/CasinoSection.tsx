import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dice1, Spade, Heart, Diamond, Club, Zap, Star } from "lucide-react";

interface CasinoGame {
  id: string;
  name: string;
  type: string;
  thumbnail: string;
  minBet: number;
  maxBet: number;
  isLive?: boolean;
  isHot?: boolean;
  players?: number;
}

const casinoGames: CasinoGame[] = [
  {
    id: '1',
    name: 'Lightning Roulette',
    type: 'Roulette',
    thumbnail: '🎰',
    minBet: 1,
    maxBet: 500,
    isLive: true,
    isHot: true,
    players: 127
  },
  {
    id: '2',
    name: 'Blackjack VIP',
    type: 'Table Game',
    thumbnail: '🃏',
    minBet: 5,
    maxBet: 1000,
    isLive: true,
    players: 89
  },
  {
    id: '3',
    name: 'Mega Fortune',
    type: 'Slot',
    thumbnail: '💎',
    minBet: 0.25,
    maxBet: 100,
    isHot: true
  },
  {
    id: '4',
    name: 'Poker Stars',
    type: 'Poker',
    thumbnail: '♠️',
    minBet: 2,
    maxBet: 200,
    isLive: true,
    players: 45
  },
  {
    id: '5',
    name: 'Dice Master',
    type: 'Dice',
    thumbnail: '🎲',
    minBet: 1,
    maxBet: 50
  },
  {
    id: '6',
    name: 'Lucky Wheel',
    type: 'Wheel',
    thumbnail: '🎡',
    minBet: 0.5,
    maxBet: 25,
    isHot: true
  }
];

export const CasinoSection = () => {
  const handlePlayGame = (gameId: string) => {
    console.log('Playing game:', gameId);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Casino Games</h2>
        <div className="flex space-x-2">
          <Badge variant="outline">Live Games</Badge>
          <Badge variant="outline">Slots</Badge>
          <Badge variant="outline">Table Games</Badge>
        </div>
      </div>

      {/* Featured Game */}
      <Card className="relative p-6 bg-gradient-primary border-0 overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <Badge className="mb-2 bg-primary-foreground text-primary">Featured</Badge>
              <h3 className="text-2xl font-bold text-primary-foreground mb-1">
                Lightning Roulette
              </h3>
              <p className="text-primary-foreground/80">
                Experience the thrill with multiplied payouts up to 500x!
              </p>
            </div>
            <Button size="lg" variant="secondary" className="shadow-lg">
              Play Now
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 text-6xl opacity-20">⚡</div>
      </Card>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {casinoGames.map((game) => (
          <Card key={game.id} className="group overflow-hidden bg-gradient-card border-border/50 hover:shadow-hover transition-all duration-300 cursor-pointer">
            <div className="aspect-video bg-secondary/20 flex items-center justify-center text-4xl relative">
              {game.thumbnail}
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex space-x-1">
                {game.isLive && (
                  <Badge variant="destructive" className="text-xs animate-pulse">
                    Live
                  </Badge>
                )}
                {game.isHot && (
                  <Badge className="text-xs bg-gradient-danger border-0">
                    <Zap className="w-3 h-3 mr-1" />
                    Hot
                  </Badge>
                )}
              </div>

              {/* Players count */}
              {game.players && (
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="text-xs">
                    {game.players} players
                  </Badge>
                </div>
              )}

              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="lg" onClick={() => handlePlayGame(game.id)}>
                  Play
                </Button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-lg">{game.name}</h3>
                  <p className="text-sm text-muted-foreground">{game.type}</p>
                </div>
                <Star className="w-4 h-4 text-warning" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Min: ${game.minBet}
                </span>
                <span className="text-muted-foreground">
                  Max: ${game.maxBet}
                </span>
              </div>

              <Button 
                className="w-full mt-3" 
                variant="outline"
                onClick={() => handlePlayGame(game.id)}
              >
                Play Game
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Game Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card className="p-4 text-center hover:shadow-card transition-shadow cursor-pointer">
          <Dice1 className="w-8 h-8 mx-auto mb-2 text-primary" />
          <h4 className="font-semibold">Dice Games</h4>
          <p className="text-xs text-muted-foreground">12 games</p>
        </Card>
        
        <Card className="p-4 text-center hover:shadow-card transition-shadow cursor-pointer">
          <Spade className="w-8 h-8 mx-auto mb-2 text-primary" />
          <h4 className="font-semibold">Card Games</h4>
          <p className="text-xs text-muted-foreground">28 games</p>
        </Card>
        
        <Card className="p-4 text-center hover:shadow-card transition-shadow cursor-pointer">
          <Zap className="w-8 h-8 mx-auto mb-2 text-warning" />
          <h4 className="font-semibold">Slots</h4>
          <p className="text-xs text-muted-foreground">156 games</p>
        </Card>
        
        <Card className="p-4 text-center hover:shadow-card transition-shadow cursor-pointer">
          <Star className="w-8 h-8 mx-auto mb-2 text-accent" />
          <h4 className="font-semibold">Live Dealer</h4>
          <p className="text-xs text-muted-foreground">24 games</p>
        </Card>
      </div>
    </div>
  );
};