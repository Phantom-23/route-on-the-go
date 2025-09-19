import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RouteStop {
  id: string;
  name: string;
  estimatedArrival: string;
  isNext: boolean;
}

interface BusRouteProps {
  routeName: string;
  stops: RouteStop[];
}

const mockStops: RouteStop[] = [
  { id: '1', name: 'Central Station', estimatedArrival: 'Passed', isNext: false },
  { id: '2', name: 'University Avenue', estimatedArrival: 'Passed', isNext: false },
  { id: '3', name: 'Main Street Station', estimatedArrival: '5 min', isNext: true },
  { id: '4', name: 'Shopping Mall', estimatedArrival: '12 min', isNext: false },
  { id: '5', name: 'City Hospital', estimatedArrival: '18 min', isNext: false },
  { id: '6', name: 'Airport Terminal', estimatedArrival: '25 min', isNext: false },
];

const BusRoute: React.FC<BusRouteProps> = ({ routeName, stops = mockStops }) => {
  return (
    <Card className="p-4 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-card-foreground">{routeName}</h2>
        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
          6 stops
        </Badge>
      </div>
      
      <div className="space-y-3">
        {stops.map((stop, index) => (
          <div key={stop.id} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div 
                className={`w-3 h-3 rounded-full ${
                  stop.isNext 
                    ? 'bg-primary shadow-[0_0_8px_hsl(var(--primary))]' 
                    : stop.estimatedArrival === 'Passed'
                    ? 'bg-muted-foreground'
                    : 'bg-muted border-2 border-primary'
                }`}
              />
              {index < stops.length - 1 && (
                <div className="w-0.5 h-6 bg-muted mt-1" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`font-medium ${stop.isNext ? 'text-primary' : 'text-card-foreground'}`}>
                  {stop.name}
                </p>
                <span className={`text-sm ${
                  stop.isNext 
                    ? 'text-primary font-medium' 
                    : stop.estimatedArrival === 'Passed'
                    ? 'text-muted-foreground'
                    : 'text-muted-foreground'
                }`}>
                  {stop.estimatedArrival}
                </span>
              </div>
              {stop.isNext && (
                <p className="text-xs text-muted-foreground mt-1">Next stop</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BusRoute;