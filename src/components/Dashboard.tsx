
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Heart, Thermometer, User, Bell } from 'lucide-react';

interface EmployeeData {
  id: string;
  name: string;
  heartRate: number;
  spO2: number;
  temperature: number;
  bloodPressure: string;
  status: 'normal' | 'warning' | 'critical';
  lastAccess: string;
  location: string;
}

const Dashboard = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([
    {
      id: 'EMP001',
      name: 'John Doe',
      heartRate: 72,
      spO2: 98,
      temperature: 98.6,
      bloodPressure: '120/80',
      status: 'normal',
      lastAccess: '2 mins ago',
      location: 'Office Floor 3'
    },
    {
      id: 'EMP002',
      name: 'Sarah Wilson',
      heartRate: 85,
      spO2: 96,
      temperature: 99.2,
      bloodPressure: '130/85',
      status: 'warning',
      lastAccess: '5 mins ago',
      location: 'Conference Room A'
    },
    {
      id: 'EMP003',
      name: 'Mike Johnson',
      heartRate: 68,
      spO2: 99,
      temperature: 98.4,
      bloodPressure: '115/75',
      status: 'normal',
      lastAccess: '1 min ago',
      location: 'Cafeteria'
    }
  ]);

  const [alerts] = useState([
    { id: 1, message: 'High heart rate detected - Sarah Wilson', type: 'warning', time: '2 mins ago' },
    { id: 2, message: 'Unauthorized access attempt - Floor 5', type: 'critical', time: '5 mins ago' },
    { id: 3, message: 'Low battery warning - Device EMP007', type: 'info', time: '10 mins ago' }
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEmployees(prev => prev.map(emp => ({
        ...emp,
        heartRate: emp.heartRate + Math.floor(Math.random() * 6) - 3,
        spO2: Math.max(95, Math.min(100, emp.spO2 + Math.floor(Math.random() * 3) - 1)),
        temperature: +(emp.temperature + (Math.random() * 0.4) - 0.2).toFixed(1)
      })));
    }, 3000);

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

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-glow mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring and control center</p>
        </div>

        {/* Alert Center */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-keeper-blue" />
              <CardTitle>Alert Center</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg glass-card">
                  <div className="flex items-center gap-3">
                    <Badge className={getAlertColor(alert.type)}>
                      {alert.type.toUpperCase()}
                    </Badge>
                    <span className="text-sm">{alert.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Vitals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {employees.map(employee => (
            <Card key={employee.id} className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-keeper-blue to-keeper-purple rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                      <CardDescription>{employee.id}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(employee.status)}>
                    {employee.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 rounded-lg bg-keeper-blue/10 border border-keeper-blue/20">
                    <Heart className="w-5 h-5 text-keeper-blue mx-auto mb-1 animate-pulse" />
                    <div className="text-2xl font-bold text-keeper-blue">{employee.heartRate}</div>
                    <div className="text-xs text-muted-foreground">BPM</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-keeper-purple/10 border border-keeper-purple/20">
                    <Activity className="w-5 h-5 text-keeper-purple mx-auto mb-1" />
                    <div className="text-2xl font-bold text-keeper-purple">{employee.spO2}%</div>
                    <div className="text-xs text-muted-foreground">SpO₂</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Thermometer className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-green-400">{employee.temperature}°F</div>
                    <div className="text-xs text-muted-foreground">Temp</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <div className="text-lg font-bold text-orange-400">{employee.bloodPressure}</div>
                    <div className="text-xs text-muted-foreground">BP</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Access:</span>
                    <span>{employee.lastAccess}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span>{employee.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-keeper-blue/20 text-keeper-blue hover:bg-keeper-blue/30 border border-keeper-blue/30">
                Export Health Report
              </Button>
              <Button className="bg-keeper-purple/20 text-keeper-purple hover:bg-keeper-purple/30 border border-keeper-purple/30">
                Access Log Report
              </Button>
              <Button className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30">
                Device Management
              </Button>
              <Button className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30">
                Emergency Protocol
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
