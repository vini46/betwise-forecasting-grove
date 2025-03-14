
import { motion } from 'framer-motion';
import { CalendarIcon, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    category: string;
    closingDate: Date;
    yesPrice: number;
    noPrice: number;
    yesVolume: number;
    noVolume: number;
    imageUrl?: string;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  const totalVolume = event.yesVolume + event.noVolume;
  const yesPercentage = Math.round((event.yesVolume / totalVolume) * 100);
  const noPercentage = 100 - yesPercentage;
  
  // Calculate time until the event's closing date
  const timeUntilClosing = formatDistanceToNow(new Date(event.closingDate), { addSuffix: true });
  
  return (
    <div className="event-card h-full">
      <div className="relative mb-4 rounded-xl overflow-hidden">
        <img 
          src={event.imageUrl || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2671&q=80'} 
          alt={event.title} 
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-0 left-0 m-3">
          <span className="inline-block bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-xs font-medium">
            {event.category}
          </span>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-3 line-clamp-2">{event.title}</h3>
      
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <CalendarIcon size={16} className="mr-1" />
        <span>Closes {timeUntilClosing}</span>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>YES ({yesPercentage}%)</span>
          <span>NO ({noPercentage}%)</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-bet-yes rounded-full"
            style={{ width: `${yesPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-muted-foreground">
          <TrendingUp size={16} className="mr-1" />
          <span>₹{totalVolume.toLocaleString()} traded</span>
        </div>
        <div className="flex space-x-1 text-sm">
          <div className="px-3 py-1 rounded-full bg-bet-yes/10 text-bet-yes font-medium">
            {Math.round(event.yesPrice * 100)}¢
          </div>
          <div className="px-3 py-1 rounded-full bg-bet-no/10 text-bet-no font-medium">
            {Math.round(event.noPrice * 100)}¢
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
