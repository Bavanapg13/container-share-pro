import { Container, TransportMode } from '@/types';
import { Ship, Truck, Train, Plane, MapPin, Calendar, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ContainerCardProps {
  container: Container;
  onBook: (container: Container) => void;
  onChat: (providerId: string) => void;
}

const transportIcons: Record<TransportMode, React.ComponentType<any>> = {
  ship: Ship,
  road: Truck,
  rail: Train,
  air: Plane,
};

const transportLabels: Record<TransportMode, string> = {
  ship: 'Ocean',
  road: 'Road',
  rail: 'Rail',
  air: 'Air',
};

export function ContainerCard({ container, onBook, onChat }: ContainerCardProps) {
  const Icon = transportIcons[container.transportMode];
  const usedPercentage = ((container.totalCapacity - container.availableCapacity) / container.totalCapacity) * 100;
  const availablePercentage = (container.availableCapacity / container.totalCapacity) * 100;

  return (
    <div className="group bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl accent-gradient flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">
                {container.providerName}
              </h3>
              <Badge variant="ocean" className="mt-1">
                {transportLabels[container.transportMode]} Freight
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display font-bold text-foreground">
              ${container.pricePerCubicMeter}
            </div>
            <div className="text-xs text-muted-foreground">per m³</div>
          </div>
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground font-medium">{container.origin}</span>
          <div className="flex-1 border-t border-dashed border-border mx-2" />
          <MapPin className="w-4 h-4 text-accent" />
          <span className="text-sm text-foreground font-medium">{container.destination}</span>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Dep: {container.departureDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Arr: {container.arrivalDate.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Capacity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Package className="w-4 h-4" />
              Available Space
            </span>
            <span className="font-semibold text-foreground">
              {container.availableCapacity} m³ / {container.totalCapacity} m³
            </span>
          </div>
          <div className="relative">
            <Progress value={usedPercentage} className="h-3" />
            <div 
              className="absolute top-0 right-0 h-3 rounded-r-full accent-gradient opacity-80"
              style={{ width: `${availablePercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{usedPercentage.toFixed(0)}% filled</span>
            <span className="text-success font-medium">{availablePercentage.toFixed(0)}% available</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 pt-2 flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onChat(container.providerId)}
        >
          Message
        </Button>
        <Button 
          className="flex-1"
          onClick={() => onBook(container)}
        >
          Book Space
        </Button>
      </div>
    </div>
  );
}
