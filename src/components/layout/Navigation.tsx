import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, Gamepad2, User, Settings, PlusCircle, MinusCircle } from "lucide-react";

interface NavigationProps {
  activeSection: 'casino' | 'sports';
  onSectionChange: (section: 'casino' | 'sports') => void;
}

export const Navigation = ({ activeSection, onSectionChange }: NavigationProps) => {
  const [balance] = useState(145250.50);

  return (
    <nav className="bg-gradient-card border-b border-border backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              BetMax
            </span>
          </div>

          {/* Main Navigation */}
          <div className="flex items-center space-x-1">
            <Button
              variant={activeSection === 'casino' ? 'default' : 'ghost'}
              onClick={() => onSectionChange('casino')}
              className="flex items-center space-x-2 px-6"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Casino</span>
            </Button>
            <Button
              variant={activeSection === 'sports' ? 'default' : 'ghost'}
              onClick={() => onSectionChange('sports')}
              className="flex items-center space-x-2 px-6"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Sports</span>
            </Button>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Wallet Balance */}
            <div className="flex items-center space-x-2 bg-secondary/50 px-4 py-2 rounded-lg">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="font-semibold">₹{balance.toFixed(2)}</span>
            </div>

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
      </div>
    </nav>
  );
};