
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, MapPin, Clock, AlertTriangle, Phone, Navigation, FileText, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmergencyIncident {
  id: string;
  employee_name: string;
  employee_id: string;
  incident_type: 'cardiac_arrest' | 'fall' | 'seizure' | 'breathing_difficulty' | 'unconscious';
  severity: 'emergency';
  location: {
    floor: number;
    zone: string;
    coordinates: [number, number];
    building: string;
  };
  vitals: {
    heart_rate?: number;
    blood_pressure?: string;
    spo2?: number;
    temperature?: number;
    consciousness: 'conscious' | 'unconscious' | 'semi_conscious';
  };
  response_team: {
    assigned: boolean;
    eta: number;
    members: string[];
  };
  instructions: string[];
  status: 'active' | 'responding' | 'resolved';
  created_at: string;
  priority: 1 | 2 | 3;
}

const SecurityDashboard = () => {
  const { toast } = useToast();
  const [incidents, setIncidents] = useState<EmergencyIncident[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [mapView, setMapView] = useState<'live' | 'incidents'>('incidents');

  useEffect(() => {
    const mockIncidents: EmergencyIncident[] = [
      {
        id: '1',
        employee_name: 'Mike Johnson',
        employee_id: 'EMP006',
        incident_type: 'cardiac_arrest',
        severity: 'emergency',
        location: {
          floor: 1,
          zone: 'Finance Wing',
          coordinates: [15.3, 42.7],
          building: 'Main Office Block'
        },
        vitals: {
          heart_rate: 142,
          blood_pressure: '165/95',
          spo2: 89,
          temperature: 100.2,
          consciousness: 'semi_conscious'
        },
        response_team: {
          assigned: true,
          eta: 3,
          members: ['Sarah Johnson (HexaNurse)', 'Security Team A']
        },
        instructions: [
          '1. Call 911 immediately if not already done',
          '2. Check for responsiveness and breathing',
          '3. Begin CPR if no pulse detected',
          '4. Use AED if available and trained',
          '5. Clear airway if obstructed',
          '6. Monitor vital signs continuously',
          '7. Prepare for paramedic handover'
        ],
        status: 'active',
        created_at: '2 minutes ago',
        priority: 1
      },
      {
        id: '2',
        employee_name: 'Emily Chen',
        employee_id: 'EMP007',
        incident_type: 'fall',
        severity: 'emergency',
        location: {
          floor: 2,
          zone: 'Stairwell B',
          coordinates: [22.1, 18.5],
          building: 'Main Office Block'
        },
        vitals: {
          consciousness: 'conscious'
        },
        response_team: {
          assigned: false,
          eta: 0,
          members: []
        },
        instructions: [
          '1. Do not move the person',
          '2. Check for head, neck, or spinal injuries',
          '3. Keep person calm and still',
          '4. Check for bleeding or broken bones',
          '5. Cover with blanket to prevent shock',
          '6. Monitor consciousness level',
          '7. Document incident details'
        ],
        status: 'active',
        created_at: '5 minutes ago',
        priority: 2
      }
    ];

    setIncidents(mockIncidents);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setIncidents(prev => prev.map(incident => ({
        ...incident,
        response_team: {
          ...incident.response_team,
          eta: Math.max(0, incident.response_team.eta - 1)
        }
      })));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getIncidentTypeIcon = (type: string) => {
    switch (type) {
      case 'cardiac_arrest': return '💔';
      case 'fall': return '🤕';
      case 'seizure': return '🧠';
      case 'breathing_difficulty': return '🫁';
      case 'unconscious': return '😵';
      default: return '⚠️';
    }
  };

  const getIncidentTypeColor = (type: string) => {
    switch (type) {
      case 'cardiac_arrest': return 'bg-red-600/20 text-red-400 border-red-600/30';
      case 'fall': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'seizure': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'breathing_difficulty': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'unconscious': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-600 text-white animate-pulse';
      case 2: return 'bg-orange-500 text-white';
      case 3: return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleAssignResponse = (incidentId: string) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === incidentId 
        ? { 
            ...incident, 
            response_team: { 
              assigned: true, 
              eta: 5, 
              members: ['Security Team A', 'HexaNurse on duty'] 
            },
            status: 'responding' as const
          }
        : incident
    ));
    
    toast({
      title: "Response Team Assigned",
      description: "Emergency response team dispatched. ETA: 5 minutes.",
    });
  };

  const handleUpdateStatus = (incidentId: string, status: 'active' | 'responding' | 'resolved') => {
    setIncidents(prev => prev.map(incident => 
      incident.id === incidentId ? { ...incident, status } : incident
    ));
    
    toast({
      title: "Status Updated",
      description: `Incident status changed to ${status}.`,
    });
  };

  const activeIncidents = incidents.filter(i => i.status === 'active' || i.status === 'responding');

  return (
    <div className="min-h-screen pt-20 px-4 pb-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-glow mb-2">Security Dashboard</h1>
          <p className="text-muted-foreground">Emergency response and incident management center</p>
        </div>

        {/* Critical Emergency Banner */}
        {activeIncidents.length > 0 && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/30 animate-pulse">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertTitle className="text-red-400">ACTIVE EMERGENCIES</AlertTitle>
            <AlertDescription>
              {activeIncidents.length} emergency incident{activeIncidents.length > 1 ? 's' : ''} requiring immediate security response
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Incidents</p>
                  <p className="text-3xl font-bold text-red-400">{activeIncidents.length}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Teams Deployed</p>
                  <p className="text-3xl font-bold text-orange-400">
                    {incidents.filter(i => i.response_team.assigned).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Response</p>
                  <p className="text-3xl font-bold text-green-400">4.2m</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Building Status</p>
                  <p className="text-xl font-bold text-keeper-blue">SECURE</p>
                </div>
                <div className="w-12 h-12 bg-keeper-blue/20 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-keeper-blue" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Incidents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {incidents.map(incident => (
            <Card key={incident.id} className="glass-card border-2 border-red-500/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getIncidentTypeIcon(incident.incident_type)}</div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {incident.employee_name}
                        <Badge className={getPriorityColor(incident.priority)}>
                          P{incident.priority}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {incident.employee_id} • {incident.created_at}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getIncidentTypeColor(incident.incident_type)}>
                    {incident.incident_type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Location Info */}
                <div className="mb-4 p-3 bg-background/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-keeper-blue" />
                    <span className="font-semibold">Location</span>
                  </div>
                  <p className="text-sm">
                    Floor {incident.location.floor}, {incident.location.zone}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Coordinates: {incident.location.coordinates[0]}, {incident.location.coordinates[1]}
                  </p>
                </div>

                {/* Vitals */}
                {Object.keys(incident.vitals).length > 1 && (
                  <div className="mb-4 p-3 bg-background/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-green-400" />
                      <span className="font-semibold">Vitals</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {incident.vitals.heart_rate && (
                        <span>HR: {incident.vitals.heart_rate} BPM</span>
                      )}
                      {incident.vitals.blood_pressure && (
                        <span>BP: {incident.vitals.blood_pressure}</span>
                      )}
                      {incident.vitals.spo2 && (
                        <span>SpO₂: {incident.vitals.spo2}%</span>
                      )}
                      <span className="col-span-2">
                        Status: <Badge className={
                          incident.vitals.consciousness === 'conscious' ? 'bg-green-500/20 text-green-400' :
                          incident.vitals.consciousness === 'semi_conscious' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }>
                          {incident.vitals.consciousness.replace('_', ' ')}
                        </Badge>
                      </span>
                    </div>
                  </div>
                )}

                {/* Response Team */}
                <div className="mb-4 p-3 bg-background/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-orange-400" />
                    <span className="font-semibold">Response Team</span>
                  </div>
                  {incident.response_team.assigned ? (
                    <div>
                      <p className="text-sm text-green-400 mb-1">✓ Team Assigned</p>
                      <p className="text-sm">ETA: {incident.response_team.eta} minutes</p>
                      <div className="text-xs text-muted-foreground">
                        {incident.response_team.members.join(', ')}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-red-400">⏳ Awaiting Assignment</p>
                  )}
                </div>

                {/* Emergency Instructions */}
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="font-semibold text-red-400">Emergency Instructions</span>
                  </div>
                  <div className="space-y-1">
                    {incident.instructions.slice(0, 3).map((instruction, index) => (
                      <p key={index} className="text-xs">{instruction}</p>
                    ))}
                    {incident.instructions.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{incident.instructions.length - 3} more instructions...
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {!incident.response_team.assigned && (
                    <Button
                      size="sm"
                      onClick={() => handleAssignResponse(incident.id)}
                      className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Assign Team
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(incident.id, 'resolved')}
                    className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                  >
                    Mark Resolved
                  </Button>
                  <Button
                    size="sm"
                    className="bg-keeper-blue/20 text-keeper-blue hover:bg-keeper-blue/30 border border-keeper-blue/30"
                  >
                    <Navigation className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Floor Map */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-keeper-blue" />
                Building Floor Map - Emergency Zones
              </CardTitle>
              <div className="flex gap-2">
                {[1, 2, 3].map(floor => (
                  <Button
                    key={floor}
                    size="sm"
                    variant={selectedFloor === floor ? 'default' : 'outline'}
                    onClick={() => setSelectedFloor(floor)}
                  >
                    Floor {floor}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative bg-background/10 rounded-lg p-6 h-96 border border-white/10">
              {/* Simulated floor map */}
              <div className="absolute inset-4 border-2 border-white/20 rounded-lg">
                <div className="absolute top-4 left-4 text-sm text-muted-foreground">
                  Floor {selectedFloor} Layout
                </div>
                
                {/* Emergency points for current floor */}
                {incidents
                  .filter(incident => incident.location.floor === selectedFloor)
                  .map(incident => (
                    <div
                      key={incident.id}
                      className="absolute animate-pulse"
                      style={{
                        left: `${incident.location.coordinates[0]}%`,
                        top: `${incident.location.coordinates[1]}%`,
                      }}
                    >
                      <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-ping" />
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {incident.employee_name}
                      </div>
                    </div>
                  ))}
                
                {/* Static floor elements */}
                <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                  🔴 Active Emergency • 🟡 Response Team • 🟢 Safe Zone
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityDashboard;
