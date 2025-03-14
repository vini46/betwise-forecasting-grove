
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const { isAuthenticated, setIsAuthModalOpen } = useApp();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background via-background to-white min-h-[90vh] flex items-center">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block bg-primary/10 text-primary font-medium px-4 py-1.5 rounded-full text-sm"
            >
              Welcome to BetWise
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
            >
              Predict the Future,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-600">
                Profit Today
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-xl text-muted-foreground max-w-lg"
            >
              A prediction market where you bet on real-world events. Harness the wisdom of crowds and put your knowledge to the test.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {isAuthenticated ? (
                <Link to="/markets">
                  <Button size="lg" className="button-primary">
                    Explore Markets <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="lg" 
                  className="button-primary"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Get Started <ArrowRight size={16} className="ml-2" />
                </Button>
              )}
              
              <Link to="/how-it-works">
                <Button variant="outline" size="lg" className="button-secondary">
                  How It Works
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex items-center text-sm text-muted-foreground"
            >
              <div className="flex -space-x-2 mr-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>Join 10,000+ users making predictions</span>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-indigo-50 to-white relative">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80" 
                    alt="Prediction Market" 
                    className="w-full h-full object-cover rounded-xl shadow-lg"
                  />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-2">Featured Market</h3>
                <p className="text-muted-foreground mb-4">Will India win more than 10 gold medals in Olympics 2024?</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-muted-foreground">Current probability</span>
                    <div className="text-2xl font-semibold">35%</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="button-yes">YES</Button>
                    <Button className="button-no">NO</Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 -z-10 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-70"></div>
            <div className="absolute -top-6 -left-6 -z-10 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-70"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
