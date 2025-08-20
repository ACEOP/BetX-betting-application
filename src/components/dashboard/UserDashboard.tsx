import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Wallet, History, CreditCard, PlusCircle, MinusCircle } from "lucide-react";

interface Bet {
  id: string;
  type: 'sports' | 'casino';
  game: string;
  amount: number;
  odds?: number;
  status: 'won' | 'lost' | 'pending' | 'void';
  date: string;
  profit?: number;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet' | 'win';
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

const mockBets: Bet[] = [
  {
    id: '1',
    type: 'sports',
    game: 'Man United vs Liverpool',
    amount: 50,
    odds: 2.45,
    status: 'won',
    date: '2024-01-15',
    profit: 72.50
  },
  {
    id: '2',
    type: 'casino',
    game: 'Lightning Roulette',
    amount: 25,
    status: 'lost',
    date: '2024-01-14',
    profit: -25
  },
  {
    id: '3',
    type: 'sports',
    game: 'Lakers vs Warriors',
    amount: 100,
    odds: 1.95,
    status: 'pending',
    date: '2024-01-15'
  }
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 500,
    method: 'Credit Card',
    status: 'completed',
    date: '2024-01-15'
  },
  {
    id: '2',
    type: 'win',
    amount: 72.50,
    method: 'Sports Bet',
    status: 'completed',
    date: '2024-01-15'
  },
  {
    id: '3',
    type: 'withdrawal',
    amount: 200,
    method: 'Bank Transfer',
    status: 'pending',
    date: '2024-01-14'
  }
];

export const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const totalBalance = 145250.50;
  const todayProfit = 2850.75;
  const weekProfit = 15285.50;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
      case 'completed':
        return 'text-success';
      case 'lost':
      case 'failed':
        return 'text-destructive';
      case 'pending':
        return 'text-warning';
      case 'void':
        return 'text-muted-foreground';
      default:
        return 'text-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'won':
      case 'completed':
        return 'default';
      case 'lost':
      case 'failed':
        return 'destructive';
      case 'pending':
        return 'secondary';
      case 'void':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <PlusCircle className="w-4 h-4" />
            <span>Deposit</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <MinusCircle className="w-4 h-4" />
            <span>Withdraw</span>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-card border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-bold">₹{totalBalance.toFixed(2)}</p>
            </div>
            <Wallet className="w-8 h-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-success border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-success-foreground/80">Today's P&L</p>
              <p className="text-2xl font-bold text-success-foreground">
                +₹{todayProfit.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-success-foreground" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-primary border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-foreground/80">Week's P&L</p>
              <p className="text-2xl font-bold text-primary-foreground">
                +₹{weekProfit.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary-foreground" />
          </div>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bets">Bet History</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Bets */}
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center">
                <History className="w-4 h-4 mr-2" />
                Recent Bets
              </h3>
              <div className="space-y-3">
                {mockBets.slice(0, 3).map((bet) => (
                  <div key={bet.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                    <div>
                      <p className="font-medium">{bet.game}</p>
                      <p className="text-sm text-muted-foreground">
                        ${bet.amount} {bet.odds && `@ ${bet.odds}`}
                      </p>
                    </div>
                    <Badge variant={getStatusBadge(bet.status)}>
                      {bet.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Bets</span>
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Win Rate</span>
                  <span className="font-semibold text-success">64%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Favorite Sport</span>
                  <span className="font-semibold">Football</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Biggest Win</span>
                  <span className="font-semibold text-success">$280.50</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bets" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Betting History</h3>
            <div className="space-y-3">
              {mockBets.map((bet) => (
                <div key={bet.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline">{bet.type}</Badge>
                      <span className="font-medium">{bet.game}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Amount: ${bet.amount} {bet.odds && `• Odds: ${bet.odds}`} • {bet.date}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {bet.profit && (
                      <span className={`font-bold ${bet.profit > 0 ? 'text-success' : 'text-destructive'}`}>
                        {bet.profit > 0 ? '+' : ''}${bet.profit.toFixed(2)}
                      </span>
                    )}
                    <Badge variant={getStatusBadge(bet.status)}>
                      {bet.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Transaction History
            </h3>
            <div className="space-y-3">
              {mockTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(transaction.status).replace('text-', 'bg-')}`} />
                    <div>
                      <p className="font-medium capitalize">{transaction.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.method} • {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.type === 'deposit' || transaction.type === 'win' ? 'text-success' : 'text-destructive'}`}>
                      {transaction.type === 'deposit' || transaction.type === 'win' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                    <Badge variant={getStatusBadge(transaction.status)} className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};