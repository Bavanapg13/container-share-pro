import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ship, Truck, Train, Plane, Plus, Package, MapPin, Calendar, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const transportIcons: Record<string, React.ComponentType<any>> = {
  ship: Ship, road: Truck, rail: Train, air: Plane,
};

export default function Dashboard() {
  const { user, role, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [containers, setContainers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    transport_mode: 'ship',
    origin: '', destination: '',
    departure_date: '', arrival_date: '',
    total_capacity: '', available_capacity: '',
    price_per_cubic_meter: '', container_type: '',
    description: '',
  });

  useEffect(() => {
    if (!authLoading && (!user || role !== 'provider')) {
      navigate('/marketplace');
      return;
    }
    if (user) fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    setLoading(true);
    const [containersRes, bookingsRes] = await Promise.all([
      supabase.from('containers').select('*').eq('provider_id', user!.id).order('created_at', { ascending: false }),
      supabase.from('bookings').select('*').eq('provider_id', user!.id).order('created_at', { ascending: false }),
    ]);
    setContainers(containersRes.data || []);
    setBookings(bookingsRes.data || []);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('containers').insert({
      provider_id: user!.id,
      transport_mode: form.transport_mode,
      origin: form.origin,
      destination: form.destination,
      departure_date: new Date(form.departure_date).toISOString(),
      arrival_date: new Date(form.arrival_date).toISOString(),
      total_capacity: parseFloat(form.total_capacity),
      available_capacity: parseFloat(form.available_capacity || form.total_capacity),
      price_per_cubic_meter: parseFloat(form.price_per_cubic_meter),
      container_type: form.container_type,
      description: form.description || null,
    } as any);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Container listed!' });
    setAddOpen(false);
    setForm({ transport_mode: 'ship', origin: '', destination: '', departure_date: '', arrival_date: '', total_capacity: '', available_capacity: '', price_per_cubic_meter: '', container_type: '', description: '' });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('containers').delete().eq('id', id);
    fetchData();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      </div>
    );
  }

  const pendingStatus = profile?.provider_status === 'pending';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">Provider Dashboard</h1>
              <p className="text-muted-foreground">Manage your container listings and bookings</p>
            </div>
            {pendingStatus && (
              <Badge variant="secondary" className="text-sm py-1 px-3">⏳ Approval Pending</Badge>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Active Listings</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold text-foreground">{containers.filter(c => c.is_active).length}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Bookings</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold text-foreground">{bookings.length}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Revenue</CardTitle></CardHeader>
              <CardContent><p className="text-3xl font-bold text-primary">${bookings.reduce((sum, b) => sum + Number(b.total_price || 0), 0).toFixed(2)}</p></CardContent>
            </Card>
          </div>

          {/* Add Container */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">Your Containers</h2>
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button disabled={pendingStatus}><Plus className="w-4 h-4 mr-2" />Add Container</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>List New Container</DialogTitle>
                  <DialogDescription>Add a container with available space for traders to book.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div>
                    <Label>Transport Mode</Label>
                    <Select value={form.transport_mode} onValueChange={v => setForm({ ...form, transport_mode: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ship">Ocean</SelectItem>
                        <SelectItem value="road">Road</SelectItem>
                        <SelectItem value="rail">Rail</SelectItem>
                        <SelectItem value="air">Air</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Origin</Label><Input value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} required placeholder="Shanghai, China" /></div>
                    <div><Label>Destination</Label><Input value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} required placeholder="Los Angeles, USA" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Departure Date</Label><Input type="datetime-local" value={form.departure_date} onChange={e => setForm({ ...form, departure_date: e.target.value })} required /></div>
                    <div><Label>Arrival Date</Label><Input type="datetime-local" value={form.arrival_date} onChange={e => setForm({ ...form, arrival_date: e.target.value })} required /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><Label>Total Capacity (m³)</Label><Input type="number" value={form.total_capacity} onChange={e => setForm({ ...form, total_capacity: e.target.value })} required /></div>
                    <div><Label>Available (m³)</Label><Input type="number" value={form.available_capacity} onChange={e => setForm({ ...form, available_capacity: e.target.value })} placeholder="Same as total" /></div>
                    <div><Label>Price/m³ ($)</Label><Input type="number" value={form.price_per_cubic_meter} onChange={e => setForm({ ...form, price_per_cubic_meter: e.target.value })} required /></div>
                  </div>
                  <div><Label>Container Type</Label><Input value={form.container_type} onChange={e => setForm({ ...form, container_type: e.target.value })} required placeholder="40ft Standard" /></div>
                  <Button type="submit" className="w-full">List Container</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Container List */}
          <div className="space-y-4">
            {containers.map(container => {
              const Icon = transportIcons[container.transport_mode] || Package;
              return (
                <Card key={container.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="w-12 h-12 rounded-xl accent-gradient flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{container.container_type}</span>
                        <Badge variant={container.is_active ? 'ocean' : 'secondary'}>
                          {container.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />{container.origin} → {container.destination}
                        <span className="mx-2">|</span>
                        <Calendar className="w-3 h-3" />{new Date(container.departure_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-foreground">${container.price_per_cubic_meter}/m³</p>
                      <p className="text-sm text-muted-foreground">{container.available_capacity}/{container.total_capacity} m³</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(container.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
            {containers.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">No containers listed</h3>
                <p className="text-muted-foreground">Add your first container to start receiving bookings.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
