import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Smartphone, Building2, Bitcoin, ArrowUpCircle, ArrowDownCircle, Shield, Clock } from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'upi' | 'bank' | 'crypto';
  icon: React.ReactNode;
  minAmount: number;
  maxAmount: number;
  processingTime: string;
  fee: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    type: 'card',
    icon: <CreditCard className="w-5 h-5" />,
    minAmount: 100,
    maxAmount: 100000,
    processingTime: 'Instant',
    fee: '2.5%'
  },
  {
    id: 'upi',
    name: 'UPI',
    type: 'upi',
    icon: <Smartphone className="w-5 h-5" />,
    minAmount: 50,
    maxAmount: 200000,
    processingTime: 'Instant',
    fee: 'Free'
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    type: 'bank',
    icon: <Building2 className="w-5 h-5" />,
    minAmount: 500,
    maxAmount: 500000,
    processingTime: '2-4 hours',
    fee: '₹10'
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    type: 'crypto',
    icon: <Bitcoin className="w-5 h-5" />,
    minAmount: 1000,
    maxAmount: 1000000,
    processingTime: '10-30 mins',
    fee: 'Network fees'
  }
];

interface DepositWithdrawProps {
  onClose: () => void;
}

export const DepositWithdraw = ({ onClose }: DepositWithdrawProps) => {
  const [activeTab, setActiveTab] = useState('deposit');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState('');
  const [depositHistory] = useState([
    { id: '1', method: 'UPI', amount: 5000, status: 'completed', date: '2024-01-15' },
    { id: '2', method: 'Card', amount: 10000, status: 'completed', date: '2024-01-14' },
  ]);
  const [withdrawHistory] = useState([
    { id: '1', method: 'UPI', amount: 2000, status: 'pending', date: '2024-01-15' },
    { id: '2', method: 'Bank', amount: 15000, status: 'completed', date: '2024-01-13' },
  ]);

  const handleSubmit = () => {
    if (!selectedMethod || !amount) return;
    
    console.log(`${activeTab}: ₹${amount} via ${selectedMethod.name}`);
    // Handle deposit/withdrawal logic here
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'pending': return 'text-warning';
      case 'failed': return 'text-destructive';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deposit" className="flex items-center space-x-2">
            <ArrowDownCircle className="w-4 h-4" />
            <span>Deposit</span>
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="flex items-center space-x-2">
            <ArrowUpCircle className="w-4 h-4" />
            <span>Withdraw</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-4">
          <div className="grid gap-3">
            <h3 className="font-semibold text-lg">Select Payment Method</h3>
            {paymentMethods.map((method) => (
              <Card
                key={method.id}
                className={`p-4 cursor-pointer transition-all border-2 ${
                  selectedMethod?.id === method.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedMethod(method)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-secondary rounded-lg">
                      {method.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{method.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ₹{method.minAmount.toLocaleString()} - ₹{method.maxAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-success">
                      <Clock className="w-3 h-3" />
                      <span>{method.processingTime}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Fee: {method.fee}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {selectedMethod && (
            <Card className="p-4 space-y-4">
              <h4 className="font-medium">Enter Amount</h4>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  ₹
                </span>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  min={selectedMethod.minAmount}
                  max={selectedMethod.maxAmount}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>Fee:</span>
                <span>{selectedMethod.fee}</span>
              </div>
              <Button onClick={handleSubmit} className="w-full" disabled={!amount}>
                Deposit ₹{amount || '0'}
              </Button>
            </Card>
          )}

          {/* Recent Deposits */}
          <Card className="p-4">
            <h4 className="font-medium mb-3">Recent Deposits</h4>
            <div className="space-y-2">
              {depositHistory.map((deposit) => (
                <div key={deposit.id} className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                  <div>
                    <span className="font-medium">₹{deposit.amount.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground ml-2">{deposit.method}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getStatusColor(deposit.status)}`}>
                      {deposit.status}
                    </div>
                    <div className="text-xs text-muted-foreground">{deposit.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-4">
          <Card className="p-4 bg-warning/10 border-warning/20">
            <div className="flex items-start space-x-2">
              <Shield className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-warning">Withdrawal Policy</h4>
                <p className="text-sm text-warning/80 mt-1">
                  You can only withdraw using the same method you used to deposit.
                  No crypto-to-fiat or fiat-to-crypto conversion allowed.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid gap-3">
            <h3 className="font-semibold text-lg">Available Withdrawal Methods</h3>
            {paymentMethods.slice(0, 2).map((method) => (
              <Card
                key={method.id}
                className={`p-4 cursor-pointer transition-all border-2 ${
                  selectedMethod?.id === method.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedMethod(method)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-secondary rounded-lg">
                      {method.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{method.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Min: ₹{method.minAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Available</Badge>
                </div>
              </Card>
            ))}
          </div>

          {selectedMethod && (
            <Card className="p-4 space-y-4">
              <h4 className="font-medium">Withdrawal Amount</h4>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  ₹
                </span>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  min={selectedMethod.minAmount}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>Processing Time:</span>
                <span>{selectedMethod.processingTime}</span>
              </div>
              <Button onClick={handleSubmit} className="w-full" disabled={!amount}>
                Withdraw ₹{amount || '0'}
              </Button>
            </Card>
          )}

          {/* Recent Withdrawals */}
          <Card className="p-4">
            <h4 className="font-medium mb-3">Recent Withdrawals</h4>
            <div className="space-y-2">
              {withdrawHistory.map((withdrawal) => (
                <div key={withdrawal.id} className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                  <div>
                    <span className="font-medium">₹{withdrawal.amount.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground ml-2">{withdrawal.method}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getStatusColor(withdrawal.status)}`}>
                      {withdrawal.status}
                    </div>
                    <div className="text-xs text-muted-foreground">{withdrawal.date}</div>
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