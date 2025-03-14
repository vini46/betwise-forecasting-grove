
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Calendar, 
  TrendingUp, 
  Info, 
  Link as LinkIcon, 
  MessageSquare,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';

interface EventDetailProps {
  eventId: string;
}

const EventDetail = ({ eventId }: EventDetailProps) => {
  const { events, placeBet, isAuthenticated, setIsAuthModalOpen } = useApp();
  const [betType, setBetType] = useState<'yes' | 'no' | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-muted-foreground">The event you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }
  
  const timeUntilClosing = formatDistanceToNow(new Date(event.closingDate), { addSuffix: true });
  const timeUntilResolution = formatDistanceToNow(new Date(event.resolutionDate), { addSuffix: true });
  
  const totalVolume = event.yesVolume + event.noVolume;
  const yesPercentage = Math.round((event.yesVolume / totalVolume) * 100);
  const noPercentage = 100 - yesPercentage;
  
  const calculatePotentialReturn = () => {
    if (!betType) return 0;
    
    const price = betType === 'yes' ? event.yesPrice : event.noPrice;
    const potentialReturn = quantity * (1 - price - event.fee);
    
    return potentialReturn > 0 ? potentialReturn : 0;
  };
  
  const handlePlaceBet = () => {
    if (!betType) return;
    
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    
    placeBet(event.id, betType, quantity);
    
    // Reset form after placing bet
    setBetType(null);
    setQuantity(1);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - Event info and betting */}
        <div className="lg:col-span-2 space-y-8">
          {/* Event header */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="h-64 relative">
              <img 
                src={event.imageUrl || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2671&q=80'} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 left-0 m-4">
                <span className="inline-block bg-white/90 backdrop-blur-sm text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                  {event.category}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{event.title}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <Calendar size={18} className="mr-2" />
                  <div>
                    <div className="text-sm">Closes {timeUntilClosing}</div>
                    <div className="text-xs">{format(new Date(event.closingDate), 'PPP')}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <TrendingUp size={18} className="mr-2" />
                  <div>
                    <div className="text-sm">₹{totalVolume.toLocaleString()} traded</div>
                    <div className="text-xs">Platform fee: {event.fee * 100}%</div>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-6">{event.description}</p>
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center text-primary font-medium"
              >
                {showDetails ? (
                  <>Hide details <ChevronUp size={16} className="ml-1" /></>
                ) : (
                  <>Show details <ChevronDown size={16} className="ml-1" /></>
                )}
              </button>
              
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-border">
                      <h3 className="font-semibold mb-2">Resolution Details</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start">
                          <Info size={16} className="mr-2 mt-0.5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Resolution Date</div>
                            <div className="text-muted-foreground">
                              {format(new Date(event.resolutionDate), 'PPP')} ({timeUntilResolution})
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <LinkIcon size={16} className="mr-2 mt-0.5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Resolution Source</div>
                            <div className="text-muted-foreground">{event.resolutionSource}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <MessageSquare size={16} className="mr-2 mt-0.5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Dispute Process</div>
                            <div className="text-muted-foreground">
                              Users can dispute the outcome within 48 hours of resolution by providing evidence.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Betting interface */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Place Your Bet</h2>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span>YES ({yesPercentage}%)</span>
                <span>NO ({noPercentage}%)</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-bet-yes rounded-full"
                  style={{ width: `${yesPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Button 
                className={`h-20 text-lg ${
                  betType === 'yes' 
                    ? 'bg-bet-yes text-bet-yes-foreground' 
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
                onClick={() => setBetType('yes')}
              >
                <div className="text-center">
                  <div className="font-semibold text-xl">YES</div>
                  <div className="text-sm">{Math.round(event.yesPrice * 100)}¢</div>
                </div>
              </Button>
              
              <Button 
                className={`h-20 text-lg ${
                  betType === 'no' 
                    ? 'bg-bet-no text-bet-no-foreground' 
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
                onClick={() => setBetType('no')}
              >
                <div className="text-center">
                  <div className="font-semibold text-xl">NO</div>
                  <div className="text-sm">{Math.round(event.noPrice * 100)}¢</div>
                </div>
              </Button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  className="h-10 w-10 rounded-l-md rounded-r-none"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  -
                </Button>
                <div className="h-10 flex-1 flex items-center justify-center border-t border-b border-input">
                  {quantity}
                </div>
                <Button 
                  variant="outline" 
                  className="h-10 w-10 rounded-r-md rounded-l-none"
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-secondary rounded-xl">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Cost</span>
                <span>
                  {betType 
                    ? `₹${((betType === 'yes' ? event.yesPrice : event.noPrice) * quantity).toFixed(2)}`
                    : '₹0.00'
                  }
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Fee ({event.fee * 100}%)</span>
                <span>
                  {betType 
                    ? `₹${(event.fee * quantity).toFixed(2)}`
                    : '₹0.00'
                  }
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Potential Return</span>
                <span>₹{calculatePotentialReturn().toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              className="w-full button-primary"
              disabled={!betType}
              onClick={handlePlaceBet}
            >
              {isAuthenticated 
                ? `Place ${betType?.toUpperCase() || ''} Bet`
                : 'Sign In to Place Bet'
              }
            </Button>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Market Stats</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Volume</span>
                <span className="font-medium">₹{totalVolume.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Yes Volume</span>
                <span className="font-medium">₹{event.yesVolume.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">No Volume</span>
                <span className="font-medium">₹{event.noVolume.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Fee</span>
                <span className="font-medium">{event.fee * 100}%</span>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">How It Works</h3>
            
            <ol className="space-y-3 text-sm">
              <li className="flex">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">1</span>
                <p>Choose YES or NO based on your prediction</p>
              </li>
              
              <li className="flex">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">2</span>
                <p>Select the quantity of contracts to purchase</p>
              </li>
              
              <li className="flex">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">3</span>
                <p>Wait for the event to resolve to see if you win</p>
              </li>
              
              <li className="flex">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs mr-2">4</span>
                <p>If your prediction is correct, receive your payout automatically</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
