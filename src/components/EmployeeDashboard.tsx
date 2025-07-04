
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Activity, Heart, Thermometer, User, Bell, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PersonalVitals {
  heartRate: number;
  spO2: number;
  temperature: number;
  bloodPressure: string;
  status: 'normal' | 'warning' | 'critical';
  lastReading: string;
}

const EmployeeDashboard = () => {
  const { toast } = useToast();
  const [vitals, setVitals] = useState<PersonalVitals>({
    heartRate: 75,
    spO2: 97,
    temperature: 98.6,
    bloodPressure: '120/80',
    status: 'normal',
    lastReading: 'Just now'
  });

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', message: 'Heart rate elevated - Take a break', time: '5 mins ago', read: false },
    { id: 2, type: 'info', message: 'Daily health summary available', time: '1 hour ago', read: true },
    { id: 3, type: 'success', message: 'All vitals normal', time: '2 hours ago', read: true }
  ]);

  // Simulate real-time health monitoring with notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => {
        const newHeartRate = prev.heartRate + Math.floor(Math.random() * 10) - 5;
        const newSpO2 = Math.max(95, Math.min(100, prev.spO2 + Math.floor(Math.random() * 3) - 1));
        const newTemp = +(prev.temperature + (Math.random() * 0.4) - 0.2).toFixed(1);
        
        // Check for anomalies and trigger notifications
        if (newHeartRate > 100) {
          toast({
            title: "Health Alert",
            description: "Your heart rate is elevated. Consider taking a break.",
            variant: "destructive",
          });
          
          setNotifications(prev => [{
            id: Date.now(),
            type: 'warning',
            message: 'Heart rate elevated - Consider taking a break',
            time: 'Just now',
            read: false
          }, ...prev]);
        }

        if (newTemp > 99.5) {
          toast({
            title: "Temperature Alert",
            description: "Your body temperature is elevated. Please monitor closely.",
            variant: "destructive",
          });
        }

        const newStatus = newHeartRate > 100 || newTemp > 99.5 ? 'warning' : 'normal';

        return {
          heartRate: newHeartRate,
          spO2: newSpO2,
          temperature: newTemp,
          bloodPressure: prev.bloodPressure,
          status: newStatus,
          lastReading: 'Just now'
        };
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen pt-20 px-4 pb-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-glow mb-2">My Health Dashboard</h1>
          <p className="text-muted-foreground">Monitor your personal health vitals and device status</p>
        </div>

        {/* Health Status Alert */}
        {vitals.status !== 'normal' && (
          <Alert className="mb-6 bg-yellow-500/10 border-yellow-500/30">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <AlertTitle className="text-yellow-400">Health Alert</AlertTitle>
            <AlertDescription>
              Some of your vitals are outside normal range. Please monitor closely and consult medical staff if needed.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Vitals */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-keeper-blue to-keeper-purple rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Your Current Vitals</CardTitle>
                      <CardDescription>Last updated: {vitals.lastReading}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(vitals.status)}>
                    {vitals.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-keeper-blue/10 border border-keeper-blue/20">
                    <Heart className="w-6 h-6 text-keeper-blue mx-auto mb-2 animate-pulse" />
                    <div className="text-3xl font-bold text-keeper-blue">{vitals.heartRate}</div>
                    <div className="text-sm text-muted-foreground">BPM</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-keeper-purple/10 border border-keeper-purple/20">
                    <Activity className="w-6 h-6 text-keeper-purple mx-auto mb-2" />
                    <div className="text-3xl font-bold text-keeper-purple">{vitals.spO2}%</div>
                    <div className="text-sm text-muted-foreground">SpO₂</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Thermometer className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-green-400">{vitals.temperature}°F</div>
                    <div className="text-sm text-muted-foreground">Temperature</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <div className="text-2xl font-bold text-orange-400">{vitals.bloodPressure}</div>
                    <div className="text-sm text-muted-foreground">Blood Pressure</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Device Status */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Device Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Battery Level</span>
                <span className="text-green-400 font-semibold">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Connection</span>
                <Badge className="bg-green-500/20 text-green-400">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Sync</span>
                <span className="text-sm">2 mins ago</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Device ID</span>
                <span className="text-sm font-mono">KPR-001</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Panel */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-keeper-blue" />
                <CardTitle>Health Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Badge className="bg-red-500/20 text-red-400">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`flex items-center justify-between p-4 rounded-lg glass-card cursor-pointer transition-colors ${
                    !notification.read ? 'bg-keeper-blue/5 border-keeper-blue/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-center gap-3">
                    {notification.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                    {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {notification.type === 'info' && <Bell className="w-4 h-4 text-blue-400" />}
                    <div>
                      <span className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                        {notification.message}
                      </span>
                      <div className="text-xs text-muted-foreground">{notification.time}</div>
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-keeper-blue rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-keeper-blue/20 text-keeper-blue hover:bg-keeper-blue/30 border border-keeper-blue/30">
                Download Health Report
              </Button>
              <Button className="bg-keeper-purple/20 text-keeper-purple hover:bg-keeper-purple/30 border border-keeper-purple/30">
                Contact Medical Support
              </Button>
              <Button className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30">
                Sync Device Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
