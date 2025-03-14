
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import EventCard from '@/components/events/EventCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const EventsList = () => {
  const { events } = useApp();
  const [visibleEvents, setVisibleEvents] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = ['All', 'Sports', 'Finance', 'Politics', 'Climate'];

  const filteredEvents = selectedCategory === 'All' 
    ? events 
    : events.filter(event => event.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Popular Prediction Markets
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the most active markets and put your knowledge to the test.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-8 space-x-2 overflow-x-auto pb-2"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`rounded-full px-6 ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent hover:bg-secondary"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredEvents.slice(0, visibleEvents).map((event) => (
            <motion.div key={event.id} variants={childVariants}>
              <Link to={`/event/${event.id}`}>
                <EventCard event={event} />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {visibleEvents < filteredEvents.length && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <Button
              className="button-secondary"
              onClick={() => setVisibleEvents((prev) => prev + 3)}
            >
              Load More
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default EventsList;
