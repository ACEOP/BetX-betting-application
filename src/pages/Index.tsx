import { useState } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { SportsSection } from "@/components/sports/SportsSection";
import { CasinoSection } from "@/components/casino/CasinoSection";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { DepositWithdraw } from "@/components/banking/DepositWithdraw";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart3 } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState<'casino' | 'sports' | 'dashboard'>('sports');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation 
        activeSection={activeSection as 'casino' | 'sports'} 
        onSectionChange={setActiveSection}
      />
      
      {/* Dashboard Toggle */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          variant={activeSection === 'dashboard' ? 'default' : 'outline'}
          onClick={() => setActiveSection(activeSection === 'dashboard' ? 'sports' : 'dashboard')}
          className="shadow-glow"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
      </div>

      {/* Main Content */}
      <main className="container mx-auto">
        {activeSection === 'sports' && <SportsSection />}
        {activeSection === 'casino' && <CasinoSection />}
        {activeSection === 'dashboard' && <UserDashboard />}
      </main>
    </div>
  );
};

export default Index;
