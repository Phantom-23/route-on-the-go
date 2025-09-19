import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BusMap from '@/components/BusMap';
import BusList from '@/components/BusList';
import BusRoute from '@/components/BusRoute';
import { MapPin, List, Route } from 'lucide-react';

const Index = () => {
  const [selectedBus, setSelectedBus] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-header shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-foreground rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-primary-foreground">BusTracker</h1>
            </div>
            <Button variant="secondary" size="sm" className="bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
              Refresh
            </Button>
          </div>
          <p className="text-primary-foreground/80 mt-2">Track your bus in real-time</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Map
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Buses
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center gap-2">
              <Route className="w-4 h-4" />
              Routes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-0">
            <Card className="overflow-hidden shadow-medium">
              <div className="h-[70vh] w-full">
                <BusMap />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <BusList onSelectBus={setSelectedBus} />
          </TabsContent>

          <TabsContent value="routes" className="mt-0">
            <div className="grid gap-6 md:grid-cols-2">
              <BusRoute routeName="Route A - Downtown Circle" stops={[]} />
              <BusRoute routeName="Route B - University Line" stops={[]} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Card className="p-4 text-center shadow-soft">
            <div className="text-2xl font-bold text-primary">3</div>
            <div className="text-sm text-muted-foreground">Active Buses</div>
          </Card>
          <Card className="p-4 text-center shadow-soft">
            <div className="text-2xl font-bold text-success">6</div>
            <div className="text-sm text-muted-foreground">Routes</div>
          </Card>
          <Card className="p-4 text-center shadow-soft">
            <div className="text-2xl font-bold text-warning">18</div>
            <div className="text-sm text-muted-foreground">Total Stops</div>
          </Card>
          <Card className="p-4 text-center shadow-soft">
            <div className="text-2xl font-bold text-primary">5 min</div>
            <div className="text-sm text-muted-foreground">Avg Wait</div>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 BusTracker. Real-time public bus tracking for everyone.
          </p>
          <div className="mt-4 space-x-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              About
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Contact
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              API Docs
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;