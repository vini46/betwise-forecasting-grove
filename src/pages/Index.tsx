
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import Hero from '@/components/home/Hero';
import EventsList from '@/components/home/EventsList';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/auth/AuthModal';

const Index = () => {
  const { events } = useApp();

  // Preload images for better user experience
  useEffect(() => {
    events.forEach(event => {
      if (event.imageUrl) {
        const img = new Image();
        img.src = event.imageUrl;
      }
    });
  }, [events]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <main>
        <Hero />
        <EventsList />
      </main>
      <Footer />
      <AuthModal />
    </motion.div>
  );
};

export default Index;
