
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, BarChart3, CheckCircle2, XCircle } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useApp } from '@/context/AppContext';
import { formatDistanceToNow, format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const AdminEventResolution = () => {
  const { events, resolveEvent } = useApp();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [resolution, setResolution] = useState<'yes' | 'no' | null>(null);
  const [isResolutionDialogOpen, setIsResolutionDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResolveClick = (eventId: string) => {
    setSelectedEvent(eventId);
    setResolution(null);
    setIsResolutionDialogOpen(true);
  };

  const handleResolveConfirm = async () => {
    if (!selectedEvent || !resolution) return;
    
    setLoading(true);
    try {
      await resolveEvent(selectedEvent, resolution);
      setIsResolutionDialogOpen(false);
    } catch (error) {
      console.error('Failed to resolve event:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sort events: open events first, then by resolution date
  const sortedEvents = [...events].sort((a, b) => {
    if (a.status === 'open' && b.status !== 'open') return -1;
    if (a.status !== 'open' && b.status === 'open') return 1;
    return new Date(a.resolutionDate).getTime() - new Date(b.resolutionDate).getTime();
  });

  return (
    <>
      <Card>
        <CardContent className="pt-6 px-0">
          <div className="px-6 mb-4">
            <h3 className="text-lg font-medium">Manage Events</h3>
            <p className="text-sm text-muted-foreground">
              Resolve events once their outcome is determined
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Resolution Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEvents.length > 0 ? (
                  sortedEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {event.title}
                        <p className="text-xs text-muted-foreground mt-1">
                          ID: {event.id}
                        </p>
                      </TableCell>
                      <TableCell>{event.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          <div>
                            <div className="text-sm">
                              {format(new Date(event.resolutionDate), 'dd MMM yyyy')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(event.resolutionDate), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {event.status === 'open' && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                            Open
                          </Badge>
                        )}
                        {event.status === 'closed' && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-50">
                            Closed
                          </Badge>
                        )}
                        {event.status === 'resolved' && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                            Resolved
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <BarChart3 size={14} className="mr-1" />
                          <span>₹{(event.yesVolume + event.noVolume).toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResolveClick(event.id)}
                          disabled={event.status === 'resolved'}
                        >
                          {event.status === 'resolved' ? 'Resolved' : 'Resolve'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No events found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isResolutionDialogOpen} onOpenChange={setIsResolutionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resolve Event</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedEvent && (
                <>
                  <div className="font-medium py-2">
                    {events.find(e => e.id === selectedEvent)?.title}
                  </div>
                  <div className="text-sm bg-yellow-50 text-yellow-800 p-3 rounded-md flex items-start gap-2 my-2">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <p>
                      This action will resolve the event and trigger payouts to winners. 
                      This action cannot be undone.
                    </p>
                  </div>
                  <div className="pt-2">Choose the outcome of this event:</div>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <button
              className={`flex flex-col items-center justify-center p-4 rounded-md border-2 transition-colors ${
                resolution === 'yes' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-green-200 hover:bg-green-50/30'
              }`}
              onClick={() => setResolution('yes')}
            >
              <CheckCircle2 size={36} className="text-green-500 mb-2" />
              <span className="font-medium">YES</span>
              <span className="text-xs text-muted-foreground">The event happened</span>
            </button>
            
            <button
              className={`flex flex-col items-center justify-center p-4 rounded-md border-2 transition-colors ${
                resolution === 'no' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-red-200 hover:bg-red-50/30'
              }`}
              onClick={() => setResolution('no')}
            >
              <XCircle size={36} className="text-red-500 mb-2" />
              <span className="font-medium">NO</span>
              <span className="text-xs text-muted-foreground">The event did not happen</span>
            </button>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResolveConfirm}
              disabled={!resolution || loading}
              className={resolution === 'yes' ? 'bg-green-600 hover:bg-green-700' : resolution === 'no' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {loading ? 'Processing...' : 'Confirm Resolution'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminEventResolution;
