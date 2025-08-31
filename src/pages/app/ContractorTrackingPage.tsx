import { useState, useEffect } from 'react';
import { MapPin, Navigation, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Contractor {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'break';
  location: string;
  lastUpdate: string;
  currentJob?: string;
  coordinates?: { lat: number; lng: number };
}

const mockContractors: Contractor[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Electrician',
    status: 'online',
    location: '123 Main St, Toronto',
    lastUpdate: '2 minutes ago',
    currentJob: 'Kitchen Renovation - Wilson',
    coordinates: { lat: 43.6532, lng: -79.3832 },
  },
  {
    id: '2',
    name: 'Mike Johnson',
    role: 'Plumber',
    status: 'online',
    location: '456 Oak Ave, Mississauga',
    lastUpdate: '5 minutes ago',
    currentJob: 'Bathroom Remodel - Chen',
    coordinates: { lat: 43.5890, lng: -79.6441 },
  },
  {
    id: '3',
    name: 'Sarah Williams',
    role: 'Carpenter',
    status: 'break',
    location: '789 Pine Rd, Oakville',
    lastUpdate: '15 minutes ago',
    coordinates: { lat: 43.4675, lng: -79.6877 },
  },
  {
    id: '4',
    name: 'Tom Davis',
    role: 'Painter',
    status: 'offline',
    location: 'Last seen: Downtown Toronto',
    lastUpdate: '1 hour ago',
  },
];

export default function ContractorTrackingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [contractors, setContractors] = useState<Contractor[]>(mockContractors);

  const filteredContractors = contractors.filter(contractor => {
    const matchesSearch = contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contractor.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || contractor.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'break': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'online': return 'default';
      case 'offline': return 'secondary';
      case 'break': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Navigation className="h-8 w-8 text-primary" />
          Contractor Tracking
        </h1>
        <p className="text-muted-foreground mt-2">
          Real-time GPS tracking and status monitoring for your team
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Team</p>
                <p className="text-2xl font-bold">{contractors.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Online</p>
                <p className="text-2xl font-bold text-green-600">
                  {contractors.filter(c => c.status === 'online').length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-500 animate-pulse" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Break</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {contractors.filter(c => c.status === 'break').length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold text-gray-600">
                  {contractors.filter(c => c.status === 'offline').length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle>Live Map</CardTitle>
              <CardDescription>Real-time contractor locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Interactive map will be displayed here
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Integration with Google Maps or Mapbox required
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contractor List */}
        <div>
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle>Team Status</CardTitle>
              <div className="mt-4 space-y-2">
                <Input
                  placeholder="Search contractors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant={selectedStatus === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStatus('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedStatus === 'online' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStatus('online')}
                  >
                    Online
                  </Button>
                  <Button
                    variant={selectedStatus === 'break' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStatus('break')}
                  >
                    Break
                  </Button>
                  <Button
                    variant={selectedStatus === 'offline' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStatus('offline')}
                  >
                    Offline
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {filteredContractors.map((contractor) => (
                    <Card key={contractor.id} className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${getStatusColor(contractor.status)}`} />
                          <div>
                            <p className="font-medium">{contractor.name}</p>
                            <p className="text-sm text-muted-foreground">{contractor.role}</p>
                          </div>
                        </div>
                        <Badge variant={getStatusVariant(contractor.status)}>
                          {contractor.status}
                        </Badge>
                      </div>
                      
                      {contractor.currentJob && (
                        <div className="mt-2 text-sm">
                          <p className="text-muted-foreground">Current Job:</p>
                          <p className="font-medium">{contractor.currentJob}</p>
                        </div>
                      )}
                      
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{contractor.location}</span>
                      </div>
                      
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Updated {contractor.lastUpdate}</span>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3"
                        onClick={() => {
                          // Navigate to contractor profile
                          window.location.href = `/app/teams/${contractor.id}`;
                        }}
                      >
                        View Details
                      </Button>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}