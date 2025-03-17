
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { CreditCard, Wallet } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepositModal = ({ isOpen, onClose }: DepositModalProps) => {
  const { addFunds } = useApp();
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add funds to wallet
      addFunds(parseFloat(amount));
      
      setAmount('');
      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Deposit failed:', error);
      toast.error('Deposit failed. Please try again.');
      setLoading(false);
    }
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet size={20} /> Add Funds to Your Wallet
          </DialogTitle>
          <DialogDescription>
            Deposit funds to your wallet to participate in prediction markets.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`border rounded-lg p-3 flex items-center gap-2 cursor-pointer transition-colors ${
                    paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-input'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard size={18} />
                  <span>Credit/Debit Card</span>
                </div>
                <div
                  className={`border rounded-lg p-3 flex items-center gap-2 cursor-pointer transition-colors ${
                    paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-input'
                  }`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0L1 21H23L12 0Z" fill="currentColor"/>
                  </svg>
                  <span>UPI</span>
                </div>
              </div>
            </div>
            
            <label className="text-sm font-medium mb-2 block">Amount (₹)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="100"
              className="mb-2"
            />
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => handleQuickAmount(500)}
                className="text-sm"
              >
                ₹500
              </Button>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => handleQuickAmount(1000)}
                className="text-sm"
              >
                ₹1,000
              </Button>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => handleQuickAmount(5000)}
                className="text-sm"
              >
                ₹5,000
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleDeposit} 
            disabled={!amount || parseFloat(amount) <= 0 || loading}
            className="button-primary"
          >
            {loading ? 'Processing...' : 'Deposit Funds'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
