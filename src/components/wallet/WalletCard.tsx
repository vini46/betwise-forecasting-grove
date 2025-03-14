
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart4, Plus, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const WalletCard = () => {
  const { user, addFunds } = useApp();
  const [amount, setAmount] = useState<number>(1000);
  const [showAddFunds, setShowAddFunds] = useState(false);

  const handleAddFunds = () => {
    if (amount > 0) {
      addFunds(amount);
      setAmount(1000);
      setShowAddFunds(false);
    }
  };

  const predefinedAmounts = [100, 500, 1000, 5000];

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="relative p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold">Your Wallet</h3>
          <Wallet size={20} className="text-muted-foreground" />
        </div>
        
        <div className="flex flex-col space-y-2">
          <span className="text-muted-foreground text-sm">Available Balance</span>
          <span className="text-3xl font-bold">₹{user?.walletBalance?.toLocaleString() || 0}</span>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            className="flex-1 justify-center items-center space-x-1 bg-primary/10 hover:bg-primary/20 text-primary"
            onClick={() => setShowAddFunds(!showAddFunds)}
          >
            <Plus size={16} />
            <span>Add Funds</span>
          </Button>
          
          <Button variant="outline" className="flex-1 justify-center items-center space-x-1">
            <BarChart4 size={16} />
            <span>History</span>
          </Button>
        </div>
        
        <motion.div
          initial={false}
          animate={{ height: showAddFunds ? 'auto' : 0, opacity: showAddFunds ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {predefinedAmounts.map((presetAmount) => (
                <Button
                  key={presetAmount}
                  variant="outline"
                  size="sm"
                  className={`rounded-full ${
                    amount === presetAmount ? 'bg-primary text-primary-foreground' : ''
                  }`}
                  onClick={() => setAmount(presetAmount)}
                >
                  ₹{presetAmount}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-2xl">₹</span>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={1}
                className="text-lg"
              />
            </div>
            
            <Button 
              className="w-full button-primary"
              onClick={handleAddFunds}
            >
              Add Funds
            </Button>
          </div>
        </motion.div>
        
        <div className="space-y-3 pt-4 border-t border-border">
          <h4 className="font-medium">Recent Transactions</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <ArrowDownLeft size={16} className="text-green-600" />
                </div>
                <div>
                  <div className="font-medium">Added Funds</div>
                  <div className="text-xs text-muted-foreground">Today, 10:30 AM</div>
                </div>
              </div>
              <span className="font-medium text-green-600">+₹5,000</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                  <ArrowUpRight size={16} className="text-red-600" />
                </div>
                <div>
                  <div className="font-medium">Placed NO Bet</div>
                  <div className="text-xs text-muted-foreground">Yesterday, 6:15 PM</div>
                </div>
              </div>
              <span className="font-medium text-red-600">-₹2,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
