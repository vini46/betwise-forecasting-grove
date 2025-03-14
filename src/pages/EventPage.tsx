
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EventDetail from '@/components/events/EventDetail';
import AuthModal from '@/components/auth/AuthModal';

const EventPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <main className="pt-24 pb-12">
        <EventDetail eventId={id || ''} />
      </main>
      <Footer />
      <AuthModal />
    </motion.div>
  );
};

export default EventPage;
