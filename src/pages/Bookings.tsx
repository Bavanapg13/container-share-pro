import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Ship, Truck, Train, Plane, MapPin, Calendar, Loader2, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const transportIcons: Record<string, React.ComponentType<any>> = {
  ship: Ship, road: Truck, rail: Train, air: Plane,
};

const statusColors: Record<string, string> = {
  pending: 'secondary',
  confirmed: 'ocean',
  cancelled: 'destructive',
  completed: 'default',
};

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('trader_id', user!.id)
      .order('created_at', { ascending: false });
    
    if (data && data.length > 0) {
      // Fetch container details
      const containerIds = [...new Set(data.map((b: any) => b.container_id))];
      const { data: containers } = await supabase
        .from('containers')
        .select('*')
        .in('id', containerIds);
      
      const containerMap = new Map(containers?.map((c: any) => [c.id, c]) || []);
      
      setBookings(data.map((b: any) => ({
        ...b,
        container: containerMap.get(b.container_id),
      })));
    } else {
      setBookings([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">My Bookings</h1>
            <p className="text-muted-foreground">Track your cargo space reservations</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
              <p className="text-muted-foreground">Browse the marketplace to find and book cargo space.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => {
                const container = booking.container;
                const Icon = container ? transportIcons[container.transport_mode] || Package : Package;
                return (
                  <Card key={booking.id}>
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="w-12 h-12 rounded-xl accent-gradient flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">
                            {container?.container_type || 'Container'}
                          </span>
                          <Badge variant={(statusColors[booking.status] || 'secondary') as any}>
                            {booking.status}
                          </Badge>
                        </div>
                        {container && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />{container.origin} → {container.destination}
                            <span className="mx-2">|</span>
                            <Calendar className="w-3 h-3" />{new Date(container.departure_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-primary">${Number(booking.total_price).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{booking.space_booked} m³</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
