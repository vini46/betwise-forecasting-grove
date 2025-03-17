
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  name: string;
  email: string;
  walletBalance: number;
};

type Event = {
  id: string;
  title: string;
  description: string;
  category: string;
  closingDate: Date;
  resolutionDate: Date;
  resolutionSource: string;
  status: 'open' | 'closed' | 'resolved';
  yesPrice: number;
  noPrice: number;
  fee: number;
  yesVolume: number;
  noVolume: number;
  imageUrl?: string;
};

type Bet = {
  id: string;
  eventId: string;
  userId: string;
  type: 'yes' | 'no';
  quantity: number;
  price: number;
  timestamp: Date;
};

interface NewEventData {
  title: string;
  description: string;
  category: string;
  closingDate: Date;
  resolutionDate: Date;
  resolutionSource: string;
  yesPrice: number;
  noPrice: number;
  fee: number;
  imageUrl?: string;
}

interface AppContextType {
  user: User | null;
  events: Event[];
  userBets: Bet[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  addFunds: (amount: number) => void;
  withdrawFunds: (amount: number) => void;
  placeBet: (eventId: string, type: 'yes' | 'no', quantity: number) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  createEvent: (eventData: NewEventData) => Promise<void>;
  resolveEvent: (eventId: string, outcome: 'yes' | 'no') => Promise<void>;
}

const defaultContext: AppContextType = {
  user: null,
  events: [],
  userBets: [],
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  addFunds: () => {},
  withdrawFunds: () => {},
  placeBet: () => {},
  isAuthModalOpen: false,
  setIsAuthModalOpen: () => {},
  createEvent: async () => {},
  resolveEvent: async () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [userBets, setUserBets] = useState<Bet[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load mock data or fetch from API
  useEffect(() => {
    // This would be replaced with actual API calls in production
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Will India win more than 10 gold medals in Olympics 2024?',
        description: 'This market resolves to YES if India wins 11 or more gold medals in the 2024 Paris Olympics, and NO otherwise.',
        category: 'Sports',
        closingDate: new Date('2024-07-25'),
        resolutionDate: new Date('2024-08-11'),
        resolutionSource: 'Official Olympic medal tally',
        status: 'open',
        yesPrice: 0.35,
        noPrice: 0.65,
        fee: 0.02,
        yesVolume: 5000,
        noVolume: 8500,
        imageUrl: 'https://images.unsplash.com/photo-1560090995-01632a28895b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2669&q=80',
      },
      {
        id: '2',
        title: 'Will Sensex cross 80,000 before December 2023?',
        description: 'This market resolves to YES if the BSE Sensex index closes above 80,000 points on any trading day before December 31, 2023.',
        category: 'Finance',
        closingDate: new Date('2023-12-30'),
        resolutionDate: new Date('2023-12-31'),
        resolutionSource: 'BSE India official closing values',
        status: 'open',
        yesPrice: 0.25,
        noPrice: 0.75,
        fee: 0.02,
        yesVolume: 10000,
        noVolume: 30000,
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
      },
      {
        id: '3',
        title: 'Will India have a normal monsoon in 2023?',
        description: 'Market resolves to YES if the India Meteorological Department declares 2023 monsoon rainfall as "normal" (96%-104% of long-period average).',
        category: 'Climate',
        closingDate: new Date('2023-09-30'),
        resolutionDate: new Date('2023-10-15'),
        resolutionSource: 'India Meteorological Department official report',
        status: 'open',
        yesPrice: 0.60,
        noPrice: 0.40,
        fee: 0.02,
        yesVolume: 12000,
        noVolume: 8000,
        imageUrl: 'https://images.unsplash.com/photo-1599155253646-ae98fef67248?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2671&q=80',
      },
      {
        id: '4',
        title: 'Will AI regulation bill pass in Indian Parliament before 2024?',
        description: 'This market resolves to YES if any AI regulatory legislation is passed by both houses of Indian Parliament before January 1, 2024.',
        category: 'Politics',
        closingDate: new Date('2023-12-31'),
        resolutionDate: new Date('2024-01-05'),
        resolutionSource: 'Official Gazette of India',
        status: 'open',
        yesPrice: 0.15,
        noPrice: 0.85,
        fee: 0.02,
        yesVolume: 3000,
        noVolume: 17000,
        imageUrl: 'https://images.unsplash.com/photo-1675541481868-6aea53dc9557?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2669&q=80',
      },
    ];

    setEvents(mockEvents);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // This would be replaced with actual API calls
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser = {
        id: '123',
        name: 'Demo User',
        email: email,
        walletBalance: 10000,
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
      toast.success('Login successful');
      
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // This would be replaced with actual API calls
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const mockUser = {
        id: '123',
        name: name,
        email: email,
        walletBalance: 5000, // New users get Rs. 5000 as bonus
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
      toast.success('Registration successful! Welcome to the platform.');
      
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Registration failed', error);
      toast.error('Registration failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setUserBets([]);
    localStorage.removeItem('user');
    toast.success('You have been logged out');
  };

  const addFunds = (amount: number) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      walletBalance: user.walletBalance + amount,
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    toast.success(`Successfully added ₹${amount.toLocaleString()} to your wallet`);
  };

  const withdrawFunds = (amount: number) => {
    if (!user) return;
    
    if (user.walletBalance < amount) {
      toast.error('Insufficient funds in your wallet');
      return;
    }
    
    const updatedUser = {
      ...user,
      walletBalance: user.walletBalance - amount,
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    toast.success(`Successfully initiated withdrawal of ₹${amount.toLocaleString()}`);
  };

  const placeBet = (eventId: string, type: 'yes' | 'no', quantity: number) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const price = type === 'yes' ? event.yesPrice : event.noPrice;
    const totalCost = price * quantity;
    
    if (user.walletBalance < totalCost) {
      toast.error('Insufficient funds in your wallet');
      return;
    }
    
    // Update user balance
    const updatedUser = {
      ...user,
      walletBalance: user.walletBalance - totalCost,
    };
    
    // Create new bet
    const newBet: Bet = {
      id: `bet-${Date.now()}`,
      eventId,
      userId: user.id,
      type,
      quantity,
      price,
      timestamp: new Date(),
    };
    
    // Update event volumes
    const updatedEvents = events.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          yesVolume: type === 'yes' ? e.yesVolume + totalCost : e.yesVolume,
          noVolume: type === 'no' ? e.noVolume + totalCost : e.noVolume,
        };
      }
      return e;
    });
    
    // Update state
    setUser(updatedUser);
    setUserBets([...userBets, newBet]);
    setEvents(updatedEvents);
    
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    toast.success(`Successfully placed a ${type.toUpperCase()} bet of ${quantity} contracts`);
  };

  const createEvent = async (eventData: NewEventData): Promise<void> => {
    try {
      // This would be replaced with actual API calls
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new event with a unique ID
      const newEvent: Event = {
        id: `event-${Date.now()}`,
        ...eventData,
        status: 'open',
        yesVolume: 0,
        noVolume: 0,
      };
      
      setEvents([...events, newEvent]);
      toast.success('Event created successfully');
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error('Failed to create event');
      throw error;
    }
  };

  const resolveEvent = async (eventId: string, outcome: 'yes' | 'no'): Promise<void> => {
    try {
      // This would be replaced with actual API calls
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the event status
      const updatedEvents = events.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            status: 'resolved' as const,
          };
        }
        return event;
      });
      
      setEvents(updatedEvents);
      
      // In a real app, this would trigger payouts to users
      toast.success(`Event resolved as ${outcome.toUpperCase()}`);
    } catch (error) {
      console.error('Failed to resolve event:', error);
      toast.error('Failed to resolve event');
      throw error;
    }
  };

  // Check for stored user data on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse stored user data', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        events,
        userBets,
        isAuthenticated,
        login,
        logout,
        register,
        addFunds,
        withdrawFunds,
        placeBet,
        isAuthModalOpen,
        setIsAuthModalOpen,
        createEvent,
        resolveEvent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
