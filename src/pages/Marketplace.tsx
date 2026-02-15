import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { ContainerCard } from '@/components/marketplace/ContainerCard';
import { BookingModal } from '@/components/marketplace/BookingModal';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Ship, Truck, Train, Plane, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ContainerRow {
  id: string;
  provider_id: string;
  transport_mode: string;
  origin: string;
  destination: string;
  departure_date: string;
  arrival_date: string;
  total_capacity: number;
  available_capacity: number;
  price_per_cubic_meter: number;
  currency: string;
  container_type: string;
  description: string | null;
  is_active: boolean;
  provider_name?: string;
}

const transportModes = [
  { id: 'all', label: 'All Modes', icon: null },
  { id: 'ship', label: 'Ocean', icon: Ship },
  { id: 'road', label: 'Road', icon: Truck },
  { id: 'rail', label: 'Rail', icon: Train },
  { id: 'air', label: 'Air', icon: Plane },
];

export default function Marketplace() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price');
  const [selectedContainer, setSelectedContainer] = useState<ContainerRow | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatProviderId, setChatProviderId] = useState<string | null>(null);
  const [containers, setContainers] = useState<ContainerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContainers();
  }, []);

  const fetchContainers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('containers')
      .select('*')
      .eq('is_active', true);
    
    if (data) {
      // Fetch provider names
      const providerIds = [...new Set(data.map((c: any) => c.provider_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, company_name, name')
        .in('user_id', providerIds);
      
      const profileMap = new Map(profiles?.map((p: any) => [p.user_id, p.company_name || p.name]) || []);
      
      setContainers(data.map((c: any) => ({
        ...c,
        provider_name: profileMap.get(c.provider_id) || 'Unknown Provider',
      })));
    }
    setLoading(false);
  };

  const filteredContainers = containers
    .filter(container => {
      const matchesSearch = 
        container.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        container.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (container.provider_name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMode = selectedMode === 'all' || container.transport_mode === selectedMode;
      return matchesSearch && matchesMode;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.price_per_cubic_meter - b.price_per_cubic_meter;
      if (sortBy === 'space') return b.available_capacity - a.available_capacity;
      if (sortBy === 'date') return new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime();
      return 0;
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Available Cargo Spaces</h1>
            <p className="text-muted-foreground">Find and book available space in containers worldwide</p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="Search by origin, destination, or provider..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {transportModes.map(mode => (
                  <Button key={mode.id} variant={selectedMode === mode.id ? 'default' : 'outline'} size="sm" onClick={() => setSelectedMode(mode.id)} className="gap-2">
                    {mode.icon && <mode.icon className="w-4 h-4" />}{mode.label}
                  </Button>
                ))}
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Lowest Price</SelectItem>
                  <SelectItem value="space">Most Space</SelectItem>
                  <SelectItem value="date">Soonest Departure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredContainers.length}</span> available containers
            </p>
            {selectedMode !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {transportModes.find(m => m.id === selectedMode)?.label}
                <button onClick={() => setSelectedMode('all')}><X className="w-3 h-3" /></button>
              </Badge>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContainers.map(container => (
                <ContainerCard
                  key={container.id}
                  container={{
                    id: container.id,
                    providerId: container.provider_id,
                    providerName: container.provider_name || 'Unknown',
                    transportMode: container.transport_mode as any,
                    origin: container.origin,
                    destination: container.destination,
                    departureDate: new Date(container.departure_date),
                    arrivalDate: new Date(container.arrival_date),
                    totalCapacity: container.total_capacity,
                    availableCapacity: container.available_capacity,
                    pricePerCubicMeter: container.price_per_cubic_meter,
                    currency: container.currency,
                    containerType: container.container_type,
                  }}
                  onBook={() => setSelectedContainer(container)}
                  onChat={(providerId) => { setChatProviderId(providerId); setChatOpen(true); }}
                />
              ))}
            </div>
          )}

          {!loading && filteredContainers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">No containers found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>

      {selectedContainer && (
        <BookingModal
          container={{
            id: selectedContainer.id,
            providerId: selectedContainer.provider_id,
            providerName: selectedContainer.provider_name || 'Unknown',
            transportMode: selectedContainer.transport_mode as any,
            origin: selectedContainer.origin,
            destination: selectedContainer.destination,
            departureDate: new Date(selectedContainer.departure_date),
            arrivalDate: new Date(selectedContainer.arrival_date),
            totalCapacity: selectedContainer.total_capacity,
            availableCapacity: selectedContainer.available_capacity,
            pricePerCubicMeter: selectedContainer.price_per_cubic_meter,
            currency: selectedContainer.currency,
            containerType: selectedContainer.container_type,
          }}
          open={!!selectedContainer}
          onClose={() => { setSelectedContainer(null); fetchContainers(); }}
        />
      )}

      <ChatSidebar open={chatOpen} onClose={() => setChatOpen(false)} providerId={chatProviderId} />
    </div>
  );
}
