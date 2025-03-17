
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { Bank, AlertCircle } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawModal = ({ isOpen, onClose }: WithdrawModalProps) => {
  const { user, withdrawFunds } = useApp();
  const [amount, setAmount] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [ifscCode, setIfscCode] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const maxWithdrawable = user?.walletBalance || 0;

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > maxWithdrawable) {
      toast.error('Insufficient funds in your wallet');
      return;
    }

    if (!accountNumber || accountNumber.length < 9) {
      toast.error('Please enter a valid account number');
      return;
    }

    if (!ifscCode || ifscCode.length < 11) {
      toast.error('Please enter a valid IFSC code');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Withdraw funds from wallet
      withdrawFunds(parseFloat(amount));
      
      setAmount('');
      setAccountNumber('');
      setIfscCode('');
      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Withdrawal failed:', error);
      toast.error('Withdrawal failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bank size={20} /> Withdraw Funds
          </DialogTitle>
          <DialogDescription>
            Withdraw funds from your wallet to your bank account.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="bg-blue-50 text-blue-800 p-3 rounded-md flex items-start gap-2">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm">Withdrawals may take 1-3 business days to reflect in your account.</p>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Available Balance: ₹{maxWithdrawable.toLocaleString()}</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to withdraw"
              min="100"
              max={maxWithdrawable.toString()}
              className="mb-4"
            />
            
            <label className="text-sm font-medium mb-2 block">Bank Account Number</label>
            <Input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter your account number"
              className="mb-4"
            />
            
            <label className="text-sm font-medium mb-2 block">IFSC Code</label>
            <Input
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              placeholder="Enter IFSC code"
              className="mb-2"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleWithdraw} 
            disabled={
              !amount || 
              parseFloat(amount) <= 0 || 
              parseFloat(amount) > maxWithdrawable || 
              !accountNumber || 
              !ifscCode || 
              loading
            }
            className="button-primary"
          >
            {loading ? 'Processing...' : 'Withdraw Funds'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
