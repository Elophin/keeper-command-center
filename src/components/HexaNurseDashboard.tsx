
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Activity, Heart, Thermometer, User, Bell, AlertTriangle, MapPin, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmployeeVitals {
  id: string;
  full_name: string;
  employee_id: string;
  department: string;
  floor_number: number;
  office_location: string;
  heart_rate: number;
  spo2: number;
  temperature: number;
  systolic_bp: number;
  diastolic_bp: number;
  stress_level: number;
  status: 'normal' | 'warning' | 'critical';
  last_reading: string;
  location: {
    floor_number: number;
    zone_name: string;
    x_coordinate: number;
    y_coordinate: number;
  };
}

interface EmergencyAlert {
  id: string;
  user_name: string;
  employee_id: string;
  alert_type: string;
  severity: 'mild' | 'moderate' | 'emergency';
  title: string;
  description: string;
  status: 'active' | 'acknowledged' | 'resolved';
  location_data: any;
  vitals_data: any;
  created_at: string;
  response_time?: number;
}

const HexaNurseDashboard = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<EmployeeVitals[]>([]);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [triageView, setTriageView] = useState<'all' | 'critical' | 'warning'>('all');

  // Simulate real-time employee vitals data
  useEffect(() => {
    const mockEmployees: EmployeeVitals[] = [
      {
        id: '1',
        full_name: 'John Doe',
        employee_id: 'EMP004',
        department: 'Engineering',
        floor_number: 3,
        office_location: 'C-301',
        heart_rate: 95,
        spo2: 96,
        temperature: 99.1,
        systolic_bp: 135,
        diastolic_bp: 88,
        stress_level: 7,
        status: 'warning',
        last_reading: '2 mins ago',
        location: {
          floor_number: 3,
          zone_name: 'Engineering Wing',
          x_coordinate: 45.2,
          y_coordinate: 32.1
        }
      },
      {
        id: '2',
        full_name: 'Sarah Wilson',
        employee_id: 'EMP005',
        department: 'Marketing',
        floor_number: 2,
        office_location: 'B-205',
        heart_rate: 68,
        spo2: 98,
        temperature: 98.4,
        systolic_bp: 118,
        diastolic_bp: 76,
        stress_level: 3,
        status: 'normal',
        last_reading: '1 min ago',
        location: {
          floor_number: 2,
          zone_name: 'Marketing Department',
          x_coordinate: 28.5,
          y_coordinate: 15.8
        }
      },
      {
        id: '3',
        full_name: 'Mike Johnson',
        employee_id: 'EMP006',
        department: 'Finance',
        floor_number: 1,
        office_location: 'A-105',
        heart_rate: 142,
        spo2: 89,
        temperature: 100.2,
        systolic_bp: 165,
        diastolic_bp: 95,
        stress_level: 9,
        status: 'critical',
        last_reading: 'Just now',
        location: {
          floor_number: 1,
          zone_name: 'Finance Wing',
          x_coordinate: 15.3,
          y_coordinate: 42.7
        }
      }
    ];

    const mockAlerts: EmergencyAlert[] = [
      {
        id: '1',
        user_name: 'Mike Johnson',
        employee_id: 'EMP006',
        alert_type: 'cardiac_stress',
        severity: 'emergency',
        title: 'Critical Heart Rate Alert',
        description: 'Heart rate exceeded 140 BPM with elevated blood pressure',
        status: 'active',
        location_data: { floor: 1, zone: 'Finance Wing', coordinates: [15.3, 42.7] },
        vitals_data: { hr: 142, bp: '165/95', spo2: 89, temp: 100.2 },
        created_at: '2 mins ago'
      },
      {
        id: '2',
        user_name: 'John Doe',
        employee_id: 'EMP004',
        alert_type: 'stress_warning',
        severity: 'moderate',
        title: 'Elevated Stress Levels',
        description: 'Sustained high stress level with increased temperature',
        status: 'acknowledged',
        location_data: { floor: 3, zone: 'Engineering Wing', coordinates: [45.2, 32.1] },
        vitals_data: { hr: 95, bp: '135/88', spo2: 96, temp: 99.1, stress: 7 },
        created_at: '5 mins ago',
        response_time: 180
      }
    ];

    setEmployees(mockEmployees);
    setAlerts(mockAlerts);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setEmployees(prev => prev.map(emp => ({
        ...emp,
        heart_rate: Math.max(60, Math.min(160, emp.heart_rate + Math.floor(Math.random() * 10) - 5)),
        spo2: Math.max(85, Math.min(100, emp.spo2 + Math.floor(Math.random() * 4) - 2)),
        temperature: +(Math.max(97, Math.min(102, emp.temperature + (Math.random() * 0.6) - 0.3)).toFixed(1)),
        stress_level: Math.max(1, Math.min(10, emp.stress_level + Math.floor(Math.random() * 3) - 1)),
        last_reading: 'Just now'
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'emergency': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'acknowledged' as const, response_time: 120 }
        : alert
    ));
    
    toast({
      title: "Alert Acknowledged",
      description: "Response team has been notified and is en route.",
    });
  };

  const handleAssignTeam = async (alertId: string) => {
    toast({
      title: "Response Team Assigned",
      description: "Emergency response team has been dispatched to the location.",
    });
  };

  const filteredEmployees = employees.filter(emp => {
    if (triageView === 'all') return true;
    return emp.status === triageView;
  });

  const criticalCount = employees.filter(emp => emp.status === 'critical').length;
  const warningCount = employees.filter(emp => emp.status === 'warning').length;
  const normalCount = employees.filter(emp => emp.status === 'normal').length;

  return (
    <div className="min-h-screen pt-20 px-4 pb-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-glow mb-2">HexaNurse Dashboard</h1>
          <p className="text-muted-foreground">Emergency triage and employee health monitoring center</p>
        </div>

        {/* Critical Alerts Banner */}
        {alerts.filter(alert => alert.severity === 'emergency' && alert.status === 'active').length > 0 && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/30 animate-pulse">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertTitle className="text-red-400">EMERGENCY ALERTS ACTIVE</AlertTitle>
            <AlertDescription>
              {alerts.filter(alert => alert.severity === 'emergency' && alert.status === 'active').length} critical emergency requiring immediate attention
            </AlertDescription>
          </Alert>
        )}

        {/* Triage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-3xl font-bold text-red-400">{criticalCount}</p>
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
                  <p className="text-sm text-muted-foreground">Warning</p>
                  <p className="text-3xl font-bold text-yellow-400">{warningCount}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Normal</p>
                  <p className="text-3xl font-bold text-green-400">{normalCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-3xl font-bold text-keeper-blue">{alerts.filter(a => a.status === 'active').length}</p>
                </div>
                <div className="w-12 h-12 bg-keeper-blue/20 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-keeper-blue" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Alerts Panel */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Emergency Triage Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.filter(alert => alert.status === 'active').map(alert => (
                <div key={alert.id} className={`p-4 rounded-lg border-2 ${
                  alert.severity === 'emergency' ? 'bg-red-500/10 border-red-500/30 animate-pulse' :
                  alert.severity === 'moderate' ? 'bg-yellow-500/10 border-yellow-500/30' :
                  'bg-blue-500/10 border-blue-500/30'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="font-semibold">{alert.user_name} ({alert.employee_id})</span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.created_at}
                        </span>
                      </div>
                      <h4 className="font-semibold text-lg mb-1">{alert.title}</h4>
                      <p className="text-muted-foreground mb-3">{alert.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Location: </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Floor {alert.location_data.floor}, {alert.location_data.zone}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Vitals: </span>
                          <span>HR: {alert.vitals_data.hr}, BP: {alert.vitals_data.bp}, SpO₂: {alert.vitals_data.spo2}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30"
                      >
                        Acknowledge
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAssignTeam(alert.id)}
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                      >
                        Assign Team
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {alerts.filter(alert => alert.status === 'active').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active emergencies. All employees are stable.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Employee Vitals Grid */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold">Live Employee Vitals</h2>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={triageView === 'all' ? 'default' : 'outline'}
                onClick={() => setTriageView('all')}
              >
                All ({employees.length})
              </Button>
              <Button
                size="sm"
                variant={triageView === 'critical' ? 'default' : 'outline'}
                onClick={() => setTriageView('critical')}
                className="text-red-400"
              >
                Critical ({criticalCount})
              </Button>
              <Button
                size="sm"
                variant={triageView === 'warning' ? 'default' : 'outline'}
                onClick={() => setTriageView('warning')}
                className="text-yellow-400"
              >
                Warning ({warningCount})
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEmployees.map(employee => (
            <Card key={employee.id} className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-keeper-blue to-keeper-purple rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{employee.full_name}</CardTitle>
                      <CardDescription>{employee.employee_id} • {employee.department}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(employee.status)}>
                    {employee.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 rounded-lg bg-keeper-blue/10 border border-keeper-blue/20">
                    <Heart className="w-4 h-4 text-keeper-blue mx-auto mb-1" />
                    <div className="text-xl font-bold text-keeper-blue">{employee.heart_rate}</div>
                    <div className="text-xs text-muted-foreground">BPM</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-keeper-purple/10 border border-keeper-purple/20">
                    <Activity className="w-4 h-4 text-keeper-purple mx-auto mb-1" />
                    <div className="text-xl font-bold text-keeper-purple">{employee.spo2}%</div>
                    <div className="text-xs text-muted-foreground">SpO₂</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Thermometer className="w-4 h-4 text-green-400 mx-auto mb-1" />
                    <div className="text-xl font-bold text-green-400">{employee.temperature}°F</div>
                    <div className="text-xs text-muted-foreground">Temp</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <div className="text-lg font-bold text-orange-400">{employee.systolic_bp}/{employee.diastolic_bp}</div>
                    <div className="text-xs text-muted-foreground">BP</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stress Level:</span>
                    <Badge className={employee.stress_level >= 7 ? 'bg-red-500/20 text-red-400' : employee.stress_level >= 4 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}>
                      {employee.stress_level}/10
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Floor {employee.floor_number}, {employee.location.zone_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Reading:</span>
                    <span>{employee.last_reading}</span>
                  </div>
                </div>

                {employee.status !== 'normal' && (
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <Button 
                      size="sm" 
                      className="w-full bg-keeper-blue/20 text-keeper-blue hover:bg-keeper-blue/30 border border-keeper-blue/30"
                    >
                      View Full Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HexaNurseDashboard;
