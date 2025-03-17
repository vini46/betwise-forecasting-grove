
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register } = useApp();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
  };

  const toggleAuthMode = () => {
    resetForm();
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
      <DialogContent className="sm:max-w-md rounded-xl p-0 overflow-hidden">
        <div className="relative h-16 bg-gradient-to-r from-primary/80 to-primary">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 rounded-full bg-white/20 hover:bg-white/40 text-white"
            onClick={() => setIsAuthModalOpen(false)}
          >
            <X size={18} />
          </Button>
        </div>
        
        <div className="px-6 pb-6 pt-2">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex justify-center mt-2 mb-6">
            <div className="grid grid-cols-2 w-full max-w-xs rounded-lg overflow-hidden">
              <button
                className={`py-2 text-sm font-medium transition-colors ${
                  authMode === 'login'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
                onClick={() => setAuthMode('login')}
              >
                Login
              </button>
              <button
                className={`py-2 text-sm font-medium transition-colors ${
                  authMode === 'register'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
                onClick={() => setAuthMode('register')}
              >
                Register
              </button>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.form
              key={authMode}
              initial={{ opacity: 0, x: authMode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: authMode === 'login' ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {authMode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email or Username</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder={authMode === 'login' ? "email or username" : "name@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button className="w-full button-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    {authMode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>{authMode === 'login' ? 'Sign In' : 'Create Account'}</>
                )}
              </Button>
              
              {authMode === 'login' && (
                <div className="text-center text-sm mt-4">
                  <a href="#" className="text-primary hover:underline">
                    Forgot your password?
                  </a>
                </div>
              )}
              
              <div className="text-center text-sm text-muted-foreground">
                {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={toggleAuthMode}
                >
                  {authMode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </div>
            </motion.form>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
