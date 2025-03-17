
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WalletDashboard from '@/components/wallet/WalletDashboard';
import UserBets from '@/components/dashboard/UserBets';
import { useApp } from '@/context/AppContext';
import AuthModal from '@/components/auth/AuthModal';

const Dashboard = () => {
  const { isAuthenticated, setIsAuthModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState('wallet');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to access your dashboard
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Sign In
            </button>
          </div>
        </div>
        <Footer />
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Your Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your wallet and track your predictions</p>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="bets">My Predictions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="wallet">
              <WalletDashboard />
            </TabsContent>
            
            <TabsContent value="bets">
              <UserBets />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
