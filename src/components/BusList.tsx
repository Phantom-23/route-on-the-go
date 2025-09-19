import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Bus {
  id: string;
  name: string;
  route: string;
  status: 'active' | 'inactive';
  estimatedArrival: string;
  nextStop: string;
  occupancy: 'low' | 'medium' | 'high';
}

interface BusListProps {
  buses?: Bus[];
  onSelectBus: (bus: Bus) => void;
}

const mockBuses: Bus[] = [
  {
    id: '1',
    name: 'Bus #101',
    route: 'Route A - Downtown Circle',
    status: 'active',
    estimatedArrival: '5 min',
    nextStop: 'Main Street Station',
    occupancy: 'medium'
  },
  {
    id: '2',
    name: 'Bus #205',
    route: 'Route B - University Line',
    status: 'active',
    estimatedArrival: '12 min',
    nextStop: 'Central Park West',
    occupancy: 'low'
  },
  {
    id: '3',
    name: 'Bus #308',
    route: 'Route C - Airport Express',
    status: 'inactive',
    estimatedArrival: 'Not in service',
    nextStop: 'Terminal 1',
    occupancy: 'high'
  }
];

const getOccupancyColor = (occupancy: string) => {
  switch (occupancy) {
    case 'low': return 'bg-success/10 text-success border-success/20';
    case 'medium': return 'bg-warning/10 text-warning border-warning/20';
    case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
    default: return 'bg-muted/10 text-muted-foreground border-muted/20';
  }
};

const getOccupancyText = (occupancy: string) => {
  switch (occupancy) {
    case 'low': return 'Low occupancy';
    case 'medium': return 'Medium occupancy';
    case 'high': return 'High occupancy';
    default: return 'Unknown';
  }
};

const BusList: React.FC<BusListProps> = ({ buses = mockBuses, onSelectBus }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground mb-4">Available Buses</h2>
      
      {buses.map((bus) => (
        <Card key={bus.id} className="p-4 shadow-soft hover:shadow-medium transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-card-foreground">{bus.name}</h3>
                <div className={`w-2 h-2 rounded-full ${bus.status === 'active' ? 'bg-bus-active' : 'bg-bus-inactive'}`} />
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">{bus.route}</p>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">Next: {bus.nextStop}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${bus.status === 'active' ? 'border-bus-active text-bus-active' : 'border-bus-inactive text-bus-inactive'}`}
                >
                  {bus.status}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getOccupancyColor(bus.occupancy)}`}
                >
                  {getOccupancyText(bus.occupancy)}
                </Badge>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-primary mb-2">
                {bus.estimatedArrival}
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onSelectBus(bus)}
                className="text-xs"
              >
                Track
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BusList;