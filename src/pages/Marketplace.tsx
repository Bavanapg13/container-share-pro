import { useState } from 'react';
import { Container, TransportMode } from '@/types';
import { Header } from '@/components/layout/Header';
import { ContainerCard } from '@/components/marketplace/ContainerCard';
import { BookingModal } from '@/components/marketplace/BookingModal';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Ship, Truck, Train, Plane, X } from 'lucide-react';

// Mock data
const mockContainers: Container[] = [
  {
    id: '1',
    providerId: 'p1',
    providerName: 'Global Shipping Co.',
    transportMode: 'ship',
    origin: 'Shanghai, China',
    destination: 'Los Angeles, USA',
    departureDate: new Date('2024-02-15'),
    arrivalDate: new Date('2024-03-10'),
    totalCapacity: 30,
    availableCapacity: 12,
    pricePerCubicMeter: 85,
    currency: 'USD',
    containerType: '40ft Standard',
  },
  {
    id: '2',
    providerId: 'p2',
    providerName: 'EuroRail Logistics',
    transportMode: 'rail',
    origin: 'Berlin, Germany',
    destination: 'Paris, France',
    departureDate: new Date('2024-02-10'),
    arrivalDate: new Date('2024-02-12'),
    totalCapacity: 20,
    availableCapacity: 8,
    pricePerCubicMeter: 45,
    currency: 'USD',
    containerType: 'Standard Rail Car',
  },
  {
    id: '3',
    providerId: 'p3',
    providerName: 'Swift Air Cargo',
    transportMode: 'air',
    origin: 'Dubai, UAE',
    destination: 'London, UK',
    departureDate: new Date('2024-02-08'),
    arrivalDate: new Date('2024-02-09'),
    totalCapacity: 10,
    availableCapacity: 4,
    pricePerCubicMeter: 320,
    currency: 'USD',
    containerType: 'Air Container ULD',
  },
  {
    id: '4',
    providerId: 'p4',
    providerName: 'Continental Trucking',
    transportMode: 'road',
    origin: 'New York, USA',
    destination: 'Chicago, USA',
    departureDate: new Date('2024-02-07'),
    arrivalDate: new Date('2024-02-09'),
    totalCapacity: 25,
    availableCapacity: 15,
    pricePerCubicMeter: 35,
    currency: 'USD',
    containerType: '53ft Trailer',
  },
  {
    id: '5',
    providerId: 'p5',
    providerName: 'Pacific Maritime',
    transportMode: 'ship',
    origin: 'Tokyo, Japan',
    destination: 'Vancouver, Canada',
    departureDate: new Date('2024-02-20'),
    arrivalDate: new Date('2024-03-05'),
    totalCapacity: 40,
    availableCapacity: 22,
    pricePerCubicMeter: 95,
    currency: 'USD',
    containerType: '40ft High Cube',
  },
  {
    id: '6',
    providerId: 'p6',
    providerName: 'Trans-Asia Railways',
    transportMode: 'rail',
    origin: 'Mumbai, India',
    destination: 'Singapore',
    departureDate: new Date('2024-02-12'),
    arrivalDate: new Date('2024-02-18'),
    totalCapacity: 35,
    availableCapacity: 20,
    pricePerCubicMeter: 55,
    currency: 'USD',
    containerType: 'Standard Rail Container',
  },
];

const transportModes = [
  { id: 'all', label: 'All Modes', icon: null },
  { id: 'ship', label: 'Ocean', icon: Ship },
  { id: 'road', label: 'Road', icon: Truck },
  { id: 'rail', label: 'Rail', icon: Train },
  { id: 'air', label: 'Air', icon: Plane },
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price');
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatProviderId, setChatProviderId] = useState<string | null>(null);

  const filteredContainers = mockContainers
    .filter(container => {
      const matchesSearch = 
        container.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        container.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        container.providerName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesMode = selectedMode === 'all' || container.transportMode === selectedMode;
      
      return matchesSearch && matchesMode;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.pricePerCubicMeter - b.pricePerCubicMeter;
      if (sortBy === 'space') return b.availableCapacity - a.availableCapacity;
      if (sortBy === 'date') return a.departureDate.getTime() - b.departureDate.getTime();
      return 0;
    });

  const handleBook = (container: Container) => {
    setSelectedContainer(container);
  };

  const handleChat = (providerId: string) => {
    setChatProviderId(providerId);
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Available Cargo Spaces
            </h1>
            <p className="text-muted-foreground">
              Find and book available space in containers worldwide
            </p>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-2xl border border-border p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by origin, destination, or provider..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Transport Mode Filter */}
              <div className="flex gap-2 flex-wrap">
                {transportModes.map(mode => (
                  <Button
                    key={mode.id}
                    variant={selectedMode === mode.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMode(mode.id)}
                    className="gap-2"
                  >
                    {mode.icon && <mode.icon className="w-4 h-4" />}
                    {mode.label}
                  </Button>
                ))}
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Lowest Price</SelectItem>
                  <SelectItem value="space">Most Space</SelectItem>
                  <SelectItem value="date">Soonest Departure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredContainers.length}</span> available containers
            </p>
            {selectedMode !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {transportModes.find(m => m.id === selectedMode)?.label}
                <button onClick={() => setSelectedMode('all')}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>

          {/* Container Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContainers.map(container => (
              <ContainerCard
                key={container.id}
                container={container}
                onBook={handleBook}
                onChat={handleChat}
              />
            ))}
          </div>

          {filteredContainers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No containers found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {selectedContainer && (
        <BookingModal
          container={selectedContainer}
          open={!!selectedContainer}
          onClose={() => setSelectedContainer(null)}
        />
      )}

      {/* Chat Sidebar */}
      <ChatSidebar
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        providerId={chatProviderId}
      />
    </div>
  );
}
