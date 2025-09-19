import React, { useEffect, useRef, useState } from 'react';
import L, { Map as LeafletMap, Marker as LeafletMarker, Polyline as LeafletPolyline } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';

// Fix for default markers in Leaflet builds
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom bus icons
const activeBusIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`
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
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`
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
    position: [40.7128, -74.006],
    status: 'active',
    estimatedArrival: '5 min',
    nextStop: 'Main Street Station',
  },
  {
    id: '2',
    name: 'Bus #205',
    route: 'Route B - University Line',
    position: [40.7589, -73.9851],
    status: 'active',
    estimatedArrival: '12 min',
    nextStop: 'Central Park West',
  },
  {
    id: '3',
    name: 'Bus #308',
    route: 'Route C - Airport Express',
    position: [40.6892, -74.0445],
    status: 'inactive',
    estimatedArrival: 'Not in service',
    nextStop: 'Terminal 1',
  },
];

// Mock route path
const routePath: [number, number][] = [
  [40.7128, -74.006],
  [40.7489, -73.9857],
  [40.7589, -73.9851],
  [40.7614, -73.9776],
  [40.7505, -73.9934],
];

const BusMap: React.FC = () => {
  const mapRef = useRef<LeafletMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<Record<string, LeafletMarker>>({});
  const routeRef = useRef<LeafletPolyline | null>(null);

  const [buses, setBuses] = useState<Bus[]>(mockBuses);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      center: [40.7128, -74.006],
      zoom: 12,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapRef.current);

    // Draw route
    routeRef.current = L.polyline(routePath, {
      color: '#4f46e5',
      weight: 4,
      opacity: 0.7,
    }).addTo(mapRef.current);

    // Add markers
    mockBuses.forEach((bus) => {
      const m = L.marker(bus.position, {
        icon: bus.status === 'active' ? activeBusIcon : inactiveBusIcon,
      })
        .addTo(mapRef.current!)
        .on('click', () => setSelectedBus(bus));

      m.bindPopup(
        `<div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto; font-size: 12px;">
          <div style="font-weight:600;">${bus.name}</div>
          <div style="color:#64748b;">${bus.route}</div>
          <div>Next: ${bus.nextStop}</div>
          <div style="color:#2563eb; font-weight:500;">ETA: ${bus.estimatedArrival}</div>
        </div>`
      );

      markersRef.current[bus.id] = m;
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = {};
      routeRef.current = null;
    };
  }, []);

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => ({
          ...bus,
          position: [
            bus.position[0] + (Math.random() - 0.5) * 0.001,
            bus.position[1] + (Math.random() - 0.5) * 0.001,
          ] as [number, number],
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Reflect position updates on the map markers
  useEffect(() => {
    buses.forEach((bus) => {
      const marker = markersRef.current[bus.id];
      if (marker) {
        marker.setLatLng(bus.position);
        if (selectedBus && selectedBus.id === bus.id) {
          setSelectedBus({ ...bus });
        }
      }
    });
  }, [buses]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full rounded-lg" />

      {selectedBus && (
        <Card className="absolute bottom-4 left-4 right-4 p-4 bg-card/95 backdrop-blur-sm shadow-medium z-[1000]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-card-foreground">{selectedBus.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedBus.route}</p>
              <p className="text-sm">Next Stop: {selectedBus.nextStop}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${selectedBus.status === 'active' ? 'bg-bus-active' : 'bg-bus-inactive'}`} />
                <span className="text-sm font-medium text-primary">{selectedBus.estimatedArrival}</span>
              </div>
            </div>
            <button onClick={() => setSelectedBus(null)} className="text-muted-foreground hover:text-foreground">
              ✕
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BusMap;
