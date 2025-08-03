
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Heart, Thermometer, User, Bell, AlertTriangle, CheckCircle, MapPin, Clock, Droplets, Coffee, Footprints, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PersonalVitals {
  heartRate: number;
  spO2: number;
  temperature: number;
  bloodPressure: string;
  status: 'normal' | 'warning' | 'critical';
  lastReading: string;
}

interface WellnessNudge {
  id: number;
  type: 'hydration' | 'activity' | 'break' | 'posture';
  message: string;
  time: string;
  action: string;
}

interface AccessEntry {
  id: number;
  location: string;
  time: string;
  type: 'entry' | 'exit';
  room: string;
}

interface ActivityLog {
  id: number;
  activity: string;
  time: string;
  duration?: string;
  details: string;
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

  const [wellnessNudges, setWellnessNudges] = useState<WellnessNudge[]>([
    { id: 1, type: 'hydration', message: "Time to hydrate! You haven't had water in 2 hours.", time: '10 mins ago', action: 'Drink Water' },
    { id: 2, type: 'activity', message: "You've been sitting for 45 minutes. Take a short walk!", time: '15 mins ago', action: 'Start Walk' },
    { id: 3, type: 'break', message: "Your stress levels are elevated. Take a 5-minute break.", time: '30 mins ago', action: 'Take Break' }
  ]);

  const [accessHistory, setAccessHistory] = useState<AccessEntry[]>([
    { id: 1, location: 'Main Entrance', time: '9:00 AM', type: 'entry', room: 'Building A' },
    { id: 2, location: 'Floor 3 East', time: '9:15 AM', type: 'entry', room: 'Conference Room B' },
    { id: 3, location: 'Cafeteria', time: '12:30 PM', type: 'entry', room: 'Lunch Area' },
    { id: 4, location: 'Cafeteria', time: '1:15 PM', type: 'exit', room: 'Lunch Area' }
  ]);

  const [activityLog, setActivityLog] = useState<ActivityLog[]>([
    { id: 1, activity: 'Device Sync', time: '2:00 PM', details: 'Wearable data synchronized successfully' },
    { id: 2, activity: 'Vitals Reading', time: '1:45 PM', duration: '30s', details: 'Automatic vitals check completed' },
    { id: 3, activity: 'Walk Detected', time: '1:30 PM', duration: '5 mins', details: 'Physical activity recorded' },
    { id: 4, activity: 'Hydration Reminder', time: '1:15 PM', details: 'Wellness nudge delivered' }
  ]);

  // Simulate real-time health monitoring with notifications and wellness nudges
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => {
        const newHeartRate = prev.heartRate + Math.floor(Math.random() * 10) - 5;
        const newSpO2 = Math.max(95, Math.min(100, prev.spO2 + Math.floor(Math.random() * 3) - 1));
        const newTemp = +(prev.temperature + (Math.random() * 0.4) - 0.2).toFixed(1);
        
        // Check for critical conditions and trigger emergency alerts
        if (newHeartRate > 120 || newTemp > 100.4) {
          toast({
            title: "EMERGENCY ALERT",
            description: "Critical vitals detected. Medical assistance has been notified.",
            variant: "destructive",
          });
          
          setNotifications(prev => [{
            id: Date.now(),
            type: 'warning',
            message: 'CRITICAL: Emergency medical response triggered',
            time: 'Just now',
            read: false
          }, ...prev]);
        } else if (newHeartRate > 100) {
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

        const newStatus = newHeartRate > 120 || newTemp > 100.4 ? 'critical' : 
                         (newHeartRate > 100 || newTemp > 99.5 ? 'warning' : 'normal');

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

  // Generate periodic wellness nudges
  useEffect(() => {
    const nudgeInterval = setInterval(() => {
      const nudgeTypes = [
        { type: 'hydration', message: "Time for a water break! Stay hydrated.", action: 'Drink Water' },
        { type: 'activity', message: "You've been stationary. Take a 2-minute walk!", action: 'Start Walk' },
        { type: 'break', message: "Time for a stretch break to relieve tension.", action: 'Stretch' },
        { type: 'posture', message: "Check your posture. Sit up straight!", action: 'Adjust Posture' }
      ];
      
      const randomNudge = nudgeTypes[Math.floor(Math.random() * nudgeTypes.length)];
      
      setWellnessNudges(prev => [{
        id: Date.now(),
        type: randomNudge.type as 'hydration' | 'activity' | 'break' | 'posture',
        message: randomNudge.message,
        time: 'Just now',
        action: randomNudge.action
      }, ...prev.slice(0, 4)]); // Keep only 5 most recent nudges
    }, 30000); // Every 30 seconds for demo

    return () => clearInterval(nudgeInterval);
  }, []);

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

  const getNudgeIcon = (type: string) => {
    switch (type) {
      case 'hydration': return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'activity': return <Footprints className="w-4 h-4 text-green-400" />;
      case 'break': return <Coffee className="w-4 h-4 text-orange-400" />;
      case 'posture': return <Lightbulb className="w-4 h-4 text-yellow-400" />;
      default: return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const handleNudgeAction = (nudgeId: number, action: string) => {
    toast({
      title: "Action Completed",
      description: `Great! You've completed: ${action}`,
    });
    
    setWellnessNudges(prev => prev.filter(nudge => nudge.id !== nudgeId));
    
    setActivityLog(prev => [{
      id: Date.now(),
      activity: `Wellness Action: ${action}`,
      time: 'Just now',
      details: 'User completed wellness nudge action'
    }, ...prev]);
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-glow mb-2">My Health Dashboard</h1>
          <p className="text-muted-foreground">Monitor your personal health vitals and device status</p>
        </div>

        {/* Emergency Alert for Critical Conditions */}
        {vitals.status === 'critical' && (
          <Alert className="mb-6 bg-red-500/20 border-red-500/30 animate-pulse">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertTitle className="text-red-400">EMERGENCY ALERT</AlertTitle>
            <AlertDescription>
              Critical health condition detected. Medical assistance has been automatically notified. Please remain calm and follow emergency protocols.
            </AlertDescription>
          </Alert>
        )}

        {/* Health Status Alert */}
        {vitals.status === 'warning' && (
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

        {/* Wellness Nudges */}
        {wellnessNudges.length > 0 && (
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Wellness Nudges
              </CardTitle>
              <CardDescription>Personalized recommendations for your wellbeing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {wellnessNudges.map(nudge => (
                  <div key={nudge.id} className="flex items-center justify-between p-4 rounded-lg glass-card bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border border-yellow-500/20">
                    <div className="flex items-center gap-3">
                      {getNudgeIcon(nudge.type)}
                      <div>
                        <span className="text-sm font-medium">{nudge.message}</span>
                        <div className="text-xs text-muted-foreground">{nudge.time}</div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleNudgeAction(nudge.id, nudge.action)}
                      className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30"
                    >
                      {nudge.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
            <TabsTrigger value="access">Access History</TabsTrigger>
            <TabsTrigger value="actions">Quick Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
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
          </TabsContent>

          <TabsContent value="activity">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-keeper-purple" />
                  Activity Log
                </CardTitle>
                <CardDescription>Your recent wearable device activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityLog.map(activity => (
                    <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg glass-card">
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-keeper-purple" />
                        <div>
                          <span className="text-sm font-medium">{activity.activity}</span>
                          {activity.duration && (
                            <span className="text-xs text-muted-foreground ml-2">({activity.duration})</span>
                          )}
                          <div className="text-xs text-muted-foreground">{activity.details}</div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-400" />
                  NFC Access History
                </CardTitle>
                <CardDescription>Your location-aware access entry history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {accessHistory.map(entry => (
                    <div key={entry.id} className="flex items-center justify-between p-4 rounded-lg glass-card">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-green-400" />
                        <div>
                          <span className="text-sm font-medium">{entry.location}</span>
                          <div className="text-xs text-muted-foreground">{entry.room}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={entry.type === 'entry' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                          {entry.type}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">{entry.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button className="bg-keeper-blue/20 text-keeper-blue hover:bg-keeper-blue/30 border border-keeper-blue/30">
                    Download Health Report
                  </Button>
                  <Button className="bg-keeper-purple/20 text-keeper-purple hover:bg-keeper-purple/30 border border-keeper-purple/30">
                    Contact Medical Support
                  </Button>
                  <Button className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30">
                    Sync Device Now
                  </Button>
                  <Button className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30">
                    Emergency Alert Test
                  </Button>
                  <Button className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30">
                    Wellness Settings
                  </Button>
                  <Button className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30">
                    Privacy Controls
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
