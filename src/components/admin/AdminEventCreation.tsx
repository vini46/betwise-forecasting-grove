
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, CalendarPlus } from 'lucide-react';

const AdminEventCreation = () => {
  const { createEvent } = useApp();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [resolutionDate, setResolutionDate] = useState('');
  const [resolutionSource, setResolutionSource] = useState('');
  const [initialYesPrice, setInitialYesPrice] = useState(50);
  const [fee, setFee] = useState(2);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth !== 'true') {
      toast.error('You need admin privileges to access this page');
      navigate('/');
    } else {
      setIsAdmin(true);
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check admin status again for security
    if (!isAdmin) {
      toast.error('You need admin privileges to create events');
      return;
    }
    
    // Validation
    if (!title || !description || !category || !closingDate || !resolutionDate || !resolutionSource) {
      toast.error('Please fill all required fields');
      return;
    }
    
    if (new Date(closingDate) > new Date(resolutionDate)) {
      toast.error('Closing date must be before resolution date');
      return;
    }
    
    setLoading(true);
    
    try {
      // Convert initial probability (0-100%) to price (0-1)
      const yesPrice = initialYesPrice / 100;
      const noPrice = 1 - yesPrice;
      
      // Convert fee from percentage to decimal
      const feeDecimal = fee / 100;
      
      const newEvent = {
        title,
        description,
        category,
        closingDate: new Date(closingDate),
        resolutionDate: new Date(resolutionDate),
        resolutionSource,
        yesPrice,
        noPrice,
        fee: feeDecimal,
        imageUrl: imageUrl || undefined,
      };
      
      await createEvent(newEvent);
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setClosingDate('');
      setResolutionDate('');
      setResolutionSource('');
      setInitialYesPrice(50);
      setFee(2);
      setImageUrl('');
      
      toast.success('Event created successfully');
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-6">
          <CalendarPlus className="text-primary" />
          <h2 className="text-xl font-semibold">Create New Prediction Market</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Event Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Will India win more than 10 gold medals in Olympics 2024?"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of the event and resolution criteria..."
                rows={4}
                required
                disabled={loading}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <Select value={category} onValueChange={setCategory} disabled={loading}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Politics">Politics</SelectItem>
                    <SelectItem value="Climate">Climate</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="closingDate" className="block text-sm font-medium mb-1">
                  Closing Date <span className="text-red-500">*</span>
                </label>
                <Input
                  id="closingDate"
                  type="datetime-local"
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="resolutionDate" className="block text-sm font-medium mb-1">
                  Resolution Date <span className="text-red-500">*</span>
                </label>
                <Input
                  id="resolutionDate"
                  type="datetime-local"
                  value={resolutionDate}
                  onChange={(e) => setResolutionDate(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="resolutionSource" className="block text-sm font-medium mb-1">
                Resolution Source <span className="text-red-500">*</span>
              </label>
              <Input
                id="resolutionSource"
                value={resolutionSource}
                onChange={(e) => setResolutionSource(e.target.value)}
                placeholder="Official Olympic medal tally"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">
                Initial YES Price: {initialYesPrice}%
              </label>
              <Slider
                value={[initialYesPrice]}
                onValueChange={(values) => setInitialYesPrice(values[0])}
                min={1}
                max={99}
                step={1}
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1%</span>
                <span>50%</span>
                <span>99%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-3">
                Platform Fee: {fee}% <span className="text-xs text-muted-foreground">(in ₹)</span>
              </label>
              <Slider
                value={[fee]}
                onValueChange={(values) => setFee(values[0])}
                min={0}
                max={10}
                step={0.5}
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>₹0</span>
                <span>₹5</span>
                <span>₹10</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTitle('');
                setDescription('');
                setCategory('');
                setClosingDate('');
                setResolutionDate('');
                setResolutionSource('');
                setInitialYesPrice(50);
                setFee(2);
                setImageUrl('');
              }}
              disabled={loading}
            >
              Reset
            </Button>
            <Button type="submit" className="button-primary flex items-center gap-2" disabled={loading}>
              {loading ? 'Creating...' : (
                <>
                  <IndianRupee size={16} />
                  Create Event
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminEventCreation;
