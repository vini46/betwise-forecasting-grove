
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, BarChart3 } from 'lucide-react';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';

const WalletDashboard = () => {
  const { user, userBets } = useApp();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // Calculate total invested and potential returns
  const totalInvested = userBets.reduce((total, bet) => {
    return total + (bet.price * bet.quantity);
  }, 0);

  const getLastTransactions = () => {
    // In a real app, this would come from an API
    // For now, we'll generate some placeholder transactions
    const mockTransactions = [
      {
        id: '1',
        type: 'deposit',
        amount: 5000,
        timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
        status: 'completed'
      },
      {
        id: '2',
        type: 'bet',
        amount: 350,
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        status: 'completed',
        eventTitle: 'Will India win more than 10 gold medals in Olympics 2024?'
      },
      {
        id: '3',
        type: 'withdraw',
        amount: 1000,
        timestamp: new Date(Date.now() - 3600000 * 5), // 5 hours ago
        status: 'pending'
      }
    ];

    return mockTransactions;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const transactions = getLastTransactions();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{user?.walletBalance.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">Available for betting</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              className="w-[48%]"
              onClick={() => setIsDepositModalOpen(true)}
            >
              <ArrowDownLeft className="mr-2 h-4 w-4" />
              Deposit
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="w-[48%]"
              onClick={() => setIsWithdrawModalOpen(true)}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Withdraw
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalInvested.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across {userBets.length} predictions</p>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              {userBets.length > 0 
                ? 'Your bets are performing well!' 
                : 'Make your first prediction to start earning!'}
            </p>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest transactions and bets</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[220px] overflow-auto">
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="flex items-start justify-between border-b pb-3">
                    <div className="flex items-start space-x-3">
                      {transaction.type === 'deposit' && <ArrowDownLeft className="mt-0.5 h-5 w-5 text-green-500" />}
                      {transaction.type === 'withdraw' && <ArrowUpRight className="mt-0.5 h-5 w-5 text-orange-500" />}
                      {transaction.type === 'bet' && <BarChart3 className="mt-0.5 h-5 w-5 text-blue-500" />}
                      
                      <div>
                        <p className="text-sm font-medium">
                          {transaction.type === 'deposit' && 'Deposit'}
                          {transaction.type === 'withdraw' && 'Withdrawal'}
                          {transaction.type === 'bet' && 'Bet Placed'}
                        </p>
                        {transaction.type === 'bet' && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {transaction.eventTitle}
                          </p>
                        )}
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDate(transaction.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        transaction.type === 'deposit' ? 'text-green-600' : 
                        transaction.type === 'withdraw' ? 'text-red-600' : ''
                      }`}>
                        {transaction.type === 'deposit' ? '+' : 
                         transaction.type === 'withdraw' ? '-' : ''}
                        ₹{transaction.amount.toLocaleString()}
                      </p>
                      <span className={`text-xs ${
                        transaction.status === 'completed' ? 'text-green-600' :
                        transaction.status === 'pending' ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent transactions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} />
      <WithdrawModal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} />
    </div>
  );
};

export default WalletDashboard;
