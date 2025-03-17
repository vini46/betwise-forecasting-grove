
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserBets = () => {
  const { userBets, events } = useApp();

  // Group bets by status: active, won, lost
  const activeBets = userBets.filter(bet => {
    const event = events.find(e => e.id === bet.eventId);
    return event && event.status !== 'resolved';
  });

  const resolvedBets = userBets.filter(bet => {
    const event = events.find(e => e.id === bet.eventId);
    return event && event.status === 'resolved';
  });

  // Helper to get event details for a bet
  const getEventDetails = (eventId: string) => {
    return events.find(e => e.id === eventId) || null;
  };

  // Total invested calculations
  const totalActive = activeBets.reduce((sum, bet) => sum + (bet.price * bet.quantity), 0);
  const totalResolved = resolvedBets.reduce((sum, bet) => sum + (bet.price * bet.quantity), 0);

  if (userBets.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No predictions yet</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            You haven't made any predictions yet. Explore markets to start predicting and earning!
          </p>
          <Link to="/markets">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Explore Markets
            </button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userBets.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeBets.length} active, {resolvedBets.length} resolved
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalActive.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {activeBets.length} active predictions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalResolved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {resolvedBets.length} resolved predictions
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({activeBets.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedBets.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <Card>
            <CardContent className="pt-6">
              {activeBets.length > 0 ? (
                <div className="space-y-4">
                  {activeBets.map(bet => {
                    const event = getEventDetails(bet.eventId);
                    if (!event) return null;
                    
                    return (
                      <div key={bet.id} className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link to={`/event/${event.id}`} className="text-lg font-medium hover:text-primary">
                              {event.title}
                            </Link>
                            <div className="flex items-center mt-1">
                              <Badge 
                                variant="outline" 
                                className={`mr-2 ${
                                  bet.type === 'yes' 
                                    ? 'bg-green-50 text-green-700' 
                                    : 'bg-red-50 text-red-700'
                                }`}
                              >
                                {bet.type.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {format(new Date(bet.timestamp), 'dd MMM yyyy • HH:mm')}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">₹{(bet.price * bet.quantity).toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">
                              {bet.quantity} {bet.quantity === 1 ? 'contract' : 'contracts'} @ {(bet.price * 100).toFixed(0)}¢
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t flex items-center text-sm text-muted-foreground">
                          <Clock size={16} className="mr-1" />
                          <span>Closes {format(new Date(event.closingDate), 'dd MMM yyyy')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You have no active predictions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resolved">
          <Card>
            <CardContent className="pt-6">
              {resolvedBets.length > 0 ? (
                <div className="space-y-4">
                  {resolvedBets.map(bet => {
                    const event = getEventDetails(bet.eventId);
                    if (!event) return null;
                    
                    // Determine if bet won (this is a simplification - in a real app would come from API)
                    // For this example, we'll just randomize it
                    const won = Math.random() > 0.5;
                    
                    return (
                      <div key={bet.id} className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link to={`/event/${event.id}`} className="text-lg font-medium hover:text-primary">
                              {event.title}
                            </Link>
                            <div className="flex items-center mt-1">
                              <Badge 
                                variant="outline" 
                                className={`mr-2 ${
                                  bet.type === 'yes' 
                                    ? 'bg-green-50 text-green-700' 
                                    : 'bg-red-50 text-red-700'
                                }`}
                              >
                                {bet.type.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {format(new Date(bet.timestamp), 'dd MMM yyyy • HH:mm')}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">₹{(bet.price * bet.quantity).toFixed(2)}</div>
                            <div className="text-sm text-muted-foreground">
                              {bet.quantity} {bet.quantity === 1 ? 'contract' : 'contracts'} @ {(bet.price * 100).toFixed(0)}¢
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t flex items-center justify-between">
                          <div className="flex items-center text-sm">
                            <span className="mr-2">Outcome:</span>
                            {won ? (
                              <span className="flex items-center text-green-600">
                                <CheckCircle size={16} className="mr-1" /> Won
                              </span>
                            ) : (
                              <span className="flex items-center text-red-600">
                                <XCircle size={16} className="mr-1" /> Lost
                              </span>
                            )}
                          </div>
                          
                          {won && (
                            <div className="text-sm font-medium text-green-600">
                              +₹{(bet.quantity * (1 - bet.price - (event.fee || 0))).toFixed(2)} profit
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>You have no resolved predictions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserBets;
