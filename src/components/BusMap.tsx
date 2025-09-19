import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom bus icons
const activeBusIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#22c55e"/>
      <path d="M8 10h16v12H8V10z" fill="white"/>
      <rect x="10" y="12" width="3" height="3" fill="#22c55e"/>
      <rect x="19" y="12" width="3" height="3" fill="#22c55e"/>
      <rect x="10" y="17" width="3" height="3" fill="#22c55e"/>
      <rect x="19" y="17" width="3" height="3" fill="#22c55e"/>
      <circle cx="11" cy="24" r="2" fill="#374151"/>
      <circle cx="21" cy="24" r="2" fill="#374151"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const inactiveBusIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#6b7280"/>
      <path d="M8 10h16v12H8V10z" fill="white"/>
      <rect x="10" y="12" width="3" height="3" fill="#6b7280"/>
      <rect x="19" y="12" width="3" height="3" fill="#6b7280"/>
      <rect x="10" y="17" width="3" height="3" fill="#6b7280"/>
      <rect x="19" y="17" width="3" height="3" fill="#6b7280"/>
      <circle cx="11" cy="24" r="2" fill="#374151"/>
      <circle cx="21" cy="24" r="2" fill="#374151"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

interface Bus {
  id: string;
  name: string;
  route: string;
  position: [number, number];
  status: 'active' | 'inactive';
  estimatedArrival: string;
  nextStop: string;
}

// Mock bus data - this would come from your Node.js backend
const mockBuses: Bus[] = [
  {
    id: '1',
    name: 'Bus #101',
    route: 'Route A - Downtown Circle',
    position: [40.7128, -74.0060],
    status: 'active',
    estimatedArrival: '5 min',
    nextStop: 'Main Street Station'
  },
  {
    id: '2',
    name: 'Bus #205',
    route: 'Route B - University Line',
    position: [40.7589, -73.9851],
    status: 'active',
    estimatedArrival: '12 min',
    nextStop: 'Central Park West'
  },
  {
    id: '3',
    name: 'Bus #308',
    route: 'Route C - Airport Express',
    position: [40.6892, -74.0445],
    status: 'inactive',
    estimatedArrival: 'Not in service',
    nextStop: 'Terminal 1'
  }
];

// Mock route path
const routePath: [number, number][] = [
  [40.7128, -74.0060],
  [40.7489, -73.9857],
  [40.7589, -73.9851],
  [40.7614, -73.9776],
  [40.7505, -73.9934]
];

const BusMap: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>(mockBuses);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prevBuses => 
        prevBuses.map(bus => ({
          ...bus,
          position: [
            bus.position[0] + (Math.random() - 0.5) * 0.001,
            bus.position[1] + (Math.random() - 0.5) * 0.001
          ] as [number, number]
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[40.7128, -74.0060]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Polyline 
          positions={routePath} 
          pathOptions={{ 
            color: '#4f46e5', 
            weight: 4,
            opacity: 0.7 
          }}
        />
        
        {buses.map((bus) => (
          <Marker
            key={bus.id}
            position={bus.position}
            icon={bus.status === 'active' ? activeBusIcon : inactiveBusIcon}
            eventHandlers={{
              click: () => setSelectedBus(bus)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{bus.name}</h3>
                <p className="text-sm text-gray-600">{bus.route}</p>
                <p className="text-sm">Next: {bus.nextStop}</p>
                <p className="text-sm font-medium text-blue-600">ETA: {bus.estimatedArrival}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Selected bus info card */}
      {selectedBus && (
        <Card className="absolute bottom-4 left-4 right-4 p-4 bg-card/95 backdrop-blur-sm shadow-medium z-[1000]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-card-foreground">{selectedBus.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedBus.route}</p>
              <p className="text-sm">Next Stop: {selectedBus.nextStop}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${selectedBus.status === 'active' ? 'bg-bus-active' : 'bg-bus-inactive'}`} />
                <span className="text-sm font-medium text-primary">
                  {selectedBus.estimatedArrival}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedBus(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BusMap;