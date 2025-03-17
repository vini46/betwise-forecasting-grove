
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdminEventCreation from '@/components/admin/AdminEventCreation';
import AdminEventResolution from '@/components/admin/AdminEventResolution';
import AdminLogin from '@/components/admin/AdminLogin';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if admin is already logged in from localStorage
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      toast.success('Welcome back, admin');
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    // Store admin authentication in localStorage
    localStorage.setItem('adminAuth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    toast.success('Admin logged out successfully');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <AdminLogin onLogin={handleLogin} />
          </motion.div>
        </div>
        <Footer />
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
          <div className="mb-8 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-6 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-2">Manage prediction markets and resolve events (in ₹)</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>

          <Tabs defaultValue="create">
            <TabsList className="mb-6">
              <TabsTrigger value="create">Create Events</TabsTrigger>
              <TabsTrigger value="resolve">Resolve Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create">
              <AdminEventCreation />
            </TabsContent>
            
            <TabsContent value="resolve">
              <AdminEventResolution />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
