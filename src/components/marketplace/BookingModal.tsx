import { useState } from 'react';
import { Container } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Ship, Truck, Train, Plane, MapPin, Calendar, Package, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface BookingModalProps {
  container: Container;
  open: boolean;
  onClose: () => void;
}

const transportIcons: Record<string, React.ComponentType<any>> = {
  ship: Ship, road: Truck, rail: Train, air: Plane,
};

export function BookingModal({ container, open, onClose }: BookingModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [spaceToBook, setSpaceToBook] = useState([Math.min(5, container.availableCapacity)]);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = spaceToBook[0] * container.pricePerCubicMeter;
  const serviceFee = totalPrice * 0.05;
  const grandTotal = totalPrice + serviceFee;
  const Icon = transportIcons[container.transportMode];
  const [bookingId, setBookingId] = useState('');

  const handleBook = async () => {
    if (!user) {
      toast({ title: 'Please log in to book', variant: 'destructive' });
      return;
    }
    setIsProcessing(true);
    const { data, error } = await supabase.from('bookings').insert({
      container_id: container.id,
      trader_id: user.id,
      provider_id: container.providerId,
      space_booked: spaceToBook[0],
      total_price: totalPrice,
      service_fee: serviceFee,
      status: 'confirmed',
      payment_id: `PAY-${Date.now()}`,
    } as any).select().single();
    
    setIsProcessing(false);
    if (error) {
      toast({ title: 'Booking failed', description: error.message, variant: 'destructive' });
      return;
    }
    setBookingId(data?.id || '');
    setStep('success');
  };

  const handleClose = () => {
    setStep('details');
    setSpaceToBook([Math.min(5, container.availableCapacity)]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        {step === 'details' && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Book Cargo Space</DialogTitle>
              <DialogDescription>Reserve space in this container</DialogDescription>
            </DialogHeader>

            <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg accent-gradient flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{container.providerName}</p>
                  <p className="text-sm text-muted-foreground">{container.containerType}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" /><span>{container.origin}</span>
                <span className="text-muted-foreground">→</span>
                <MapPin className="w-4 h-4 text-accent" /><span>{container.destination}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /><span>{container.departureDate.toLocaleDateString()}</span>
                </div>
                <Badge variant="ocean">{container.availableCapacity} m³ available</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2"><Package className="w-4 h-4" />Space to book (m³)</Label>
              <Slider value={spaceToBook} onValueChange={setSpaceToBook} min={1} max={container.availableCapacity} step={1} className="py-4" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">1 m³</span>
                <span className="font-semibold text-foreground">{spaceToBook[0]} m³ selected</span>
                <span className="text-muted-foreground">{container.availableCapacity} m³</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{spaceToBook[0]} m³ × ${container.pricePerCubicMeter}</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service fee (5%)</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <Button size="lg" onClick={handleBook} disabled={isProcessing} className="w-full">
              {isProcessing ? 'Processing...' : `Pay & Book - $${grandTotal.toFixed(2)}`}
            </Button>
          </>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h3>
            <p className="text-muted-foreground mb-6">Your cargo space has been reserved.</p>
            <div className="bg-secondary/50 rounded-xl p-4 mb-6 text-left">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Booking ID</span>
                  <p className="font-mono font-semibold text-xs">{bookingId.slice(0, 8).toUpperCase()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Space Booked</span>
                  <p className="font-semibold">{spaceToBook[0]} m³</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Route</span>
                  <p className="font-semibold">{container.origin} → {container.destination}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Paid</span>
                  <p className="font-semibold text-primary">${grandTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
