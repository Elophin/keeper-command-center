
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, TrendingDown, Users, FileText, Clock, 
  AlertTriangle, Shield, Activity, BarChart3, Download,
  Calendar, Search, Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WellnessTrend {
  period: string;
  totalEmployees: number;
  healthyCount: number;
  atRiskCount: number;
  criticalCount: number;
  avgStressLevel: number;
  incidentCount: number;
}

interface AccessRequest {
  id: string;
  requester_name: string;
  requester_id: string;
  target_employee: string;
  request_type: 'health_summary' | 'incident_report' | 'wellness_data' | 'emergency_contact';
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  requested_at: string;
  urgency: 'low' | 'medium' | 'high';
}

interface IncidentLog {
  id: string;
  employee_name: string;
  incident_type: string;
  severity: 'mild' | 'moderate' | 'emergency';
  location: string;
  response_time: number;
  resolved_at: string;
  status: 'resolved' | 'ongoing';
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [wellnessData, setWellnessData] = useState<WellnessTrend[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [incidentLogs, setIncidentLogs] = useState<IncidentLog[]>([]);
  const [newAccessRequest, setNewAccessRequest] = useState({
    target_employee: '',
    request_type: 'health_summary' as AccessRequest['request_type'],
    reason: '',
    urgency: 'medium' as AccessRequest['urgency']
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  useEffect(() => {
    // Mock wellness trends data
    const mockWellnessData: WellnessTrend[] = [
      {
        period: 'This Week',
        totalEmployees: 150,
        healthyCount: 128,
        atRiskCount: 18,
        criticalCount: 4,
        avgStressLevel: 4.2,
        incidentCount: 3
      },
      {
        period: 'Last Week',
        totalEmployees: 148,
        healthyCount: 125,
        atRiskCount: 20,
        criticalCount: 3,
        avgStressLevel: 4.5,
        incidentCount: 2
      },
      {
        period: 'This Month',
        totalEmployees: 152,
        healthyCount: 131,
        atRiskCount: 17,
        criticalCount: 4,
        avgStressLevel: 4.1,
        incidentCount: 8
      }
    ];

    const mockAccessRequests: AccessRequest[] = [
      {
        id: '1',
        requester_name: 'John Smith',
        requester_id: 'HR001',
        target_employee: 'Mike Johnson (EMP006)',
        request_type: 'health_summary',
        reason: 'Employee wellness check following reported stress symptoms',
        status: 'pending',
        requested_at: '2 hours ago',
        urgency: 'high'
      },
      {
        id: '2',
        requester_name: 'Sarah Wilson',
        requester_id: 'MG002',
        target_employee: 'Emily Chen (EMP007)',
        request_type: 'incident_report',
        reason: 'Required for insurance claim processing after workplace incident',
        status: 'approved',
        requested_at: '1 day ago',
        urgency: 'medium'
      },
      {
        id: '3',
        requester_name: 'David Lee',
        requester_id: 'HR003',
        target_employee: 'Alex Rodriguez (EMP008)',
        request_type: 'wellness_data',
        reason: 'Quarterly performance review and wellness assessment',
        status: 'pending',
        requested_at: '3 hours ago',
        urgency: 'low'
      }
    ];

    const mockIncidentLogs: IncidentLog[] = [
      {
        id: '1',
        employee_name: 'Mike Johnson',
        incident_type: 'Cardiac Stress',
        severity: 'emergency',
        location: 'Floor 1 - Finance Wing',
        response_time: 4,
        resolved_at: '2 hours ago',
        status: 'resolved'
      },
      {
        id: '2',
        employee_name: 'Emily Chen',
        incident_type: 'Fall Incident',
        severity: 'moderate',
        location: 'Floor 2 - Stairwell B',
        response_time: 3,
        resolved_at: '1 day ago',
        status: 'resolved'
      },
      {
        id: '3',
        employee_name: 'John Doe',
        incident_type: 'Stress Alert',
        severity: 'mild',
        location: 'Floor 3 - Engineering',
        response_time: 8,
        resolved_at: '2 days ago',
        status: 'resolved'
      }
    ];

    setWellnessData(mockWellnessData);
    setAccessRequests(mockAccessRequests);
    setIncidentLogs(mockIncidentLogs);
  }, []);

  const handleSubmitAccessRequest = () => {
    if (!newAccessRequest.target_employee || !newAccessRequest.reason) {
      toast({
        title: "Incomplete Request",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const request: AccessRequest = {
      id: Date.now().toString(),
      requester_name: 'Current Admin User',
      requester_id: 'ADMIN001',
      target_employee: newAccessRequest.target_employee,
      request_type: newAccessRequest.request_type,
      reason: newAccessRequest.reason,
      status: 'pending',
      requested_at: 'Just now',
      urgency: newAccessRequest.urgency
    };

    setAccessRequests(prev => [request, ...prev]);
    setNewAccessRequest({
      target_employee: '',
      request_type: 'health_summary',
      reason: '',
      urgency: 'medium'
    });

    toast({
      title: "Access Request Submitted",
      description: "Your request has been submitted for HexaNurse approval.",
    });
  };

  const handleApproveRequest = (requestId: string) => {
    setAccessRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' as const } : req
    ));
    toast({
      title: "Request Approved",
      description: "Access request has been approved by HexaNurse.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'denied': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'emergency': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'mild': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const currentTrend = wellnessData[0];
  const healthPercentage = currentTrend ? (currentTrend.healthyCount / currentTrend.totalEmployees * 100) : 0;

  return (
    <div className="min-h-screen pt-20 px-4 pb-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-glow mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Organization-wide wellness monitoring and access management</p>
        </div>

        {/* Wellness Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                  <p className="text-3xl font-bold text-keeper-blue">{currentTrend?.totalEmployees || 0}</p>
                </div>
                <div className="w-12 h-12 bg-keeper-blue/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-keeper-blue" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Health Score</p>
                  <p className="text-3xl font-bold text-green-400">{healthPercentage.toFixed(1)}%</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">At Risk</p>
                  <p className="text-3xl font-bold text-yellow-400">{currentTrend?.atRiskCount || 0}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Stress</p>
                  <p className="text-3xl font-bold text-orange-400">{currentTrend?.avgStressLevel || 0}/10</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="wellness" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wellness">Wellness Trends</TabsTrigger>
            <TabsTrigger value="access">Access Requests</TabsTrigger>
            <TabsTrigger value="incidents">Incident Logs</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="wellness" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-keeper-blue" />
                    Organization Wellness Trends
                  </CardTitle>
                  <Select value={selectedTimeRange} onValueChange={(value) => setSelectedTimeRange(value as any)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {wellnessData.map((trend, index) => (
                    <div key={index} className="p-4 bg-background/20 rounded-lg">
                      <h4 className="font-semibold mb-3">{trend.period}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-400">Healthy:</span>
                          <span>{trend.healthyCount} ({(trend.healthyCount/trend.totalEmployees*100).toFixed(1)}%)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-yellow-400">At Risk:</span>
                          <span>{trend.atRiskCount} ({(trend.atRiskCount/trend.totalEmployees*100).toFixed(1)}%)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-red-400">Critical:</span>
                          <span>{trend.criticalCount} ({(trend.criticalCount/trend.totalEmployees*100).toFixed(1)}%)</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                          <span className="text-muted-foreground">Incidents:</span>
                          <span>{trend.incidentCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Submit New Request */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-keeper-blue" />
                    Submit Access Request
                  </CardTitle>
                  <CardDescription>
                    Request access to employee health data from HexaNurse
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="target-employee">Target Employee</Label>
                    <Input
                      id="target-employee"
                      placeholder="Enter employee name or ID"
                      value={newAccessRequest.target_employee}
                      onChange={(e) => setNewAccessRequest(prev => ({ ...prev, target_employee: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="request-type">Request Type</Label>
                    <Select value={newAccessRequest.request_type} onValueChange={(value) => setNewAccessRequest(prev => ({ ...prev, request_type: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health_summary">Health Summary</SelectItem>
                        <SelectItem value="incident_report">Incident Report</SelectItem>
                        <SelectItem value="wellness_data">Wellness Data</SelectItem>
                        <SelectItem value="emergency_contact">Emergency Contact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select value={newAccessRequest.urgency} onValueChange={(value) => setNewAccessRequest(prev => ({ ...prev, urgency: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="reason">Reason for Request</Label>
                    <Textarea
                      id="reason"
                      placeholder="Explain why you need access to this information..."
                      value={newAccessRequest.reason}
                      onChange={(e) => setNewAccessRequest(prev => ({ ...prev, reason: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSubmitAccessRequest}
                    className="w-full bg-keeper-blue/20 text-keeper-blue hover:bg-keeper-blue/30 border border-keeper-blue/30"
                  >
                    Submit Request
                  </Button>
                </CardContent>
              </Card>

              {/* Request History */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-keeper-purple" />
                    Request History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {accessRequests.map(request => (
                      <div key={request.id} className="p-4 bg-background/20 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{request.target_employee}</p>
                            <p className="text-sm text-muted-foreground">{request.requested_at}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getUrgencyColor(request.urgency)}>
                              {request.urgency}
                            </Badge>
                            <Badge className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm mb-2">
                          <span className="text-muted-foreground">Type: </span>
                          {request.request_type.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-muted-foreground">{request.reason}</p>
                        
                        {request.status === 'pending' && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              onClick={() => handleApproveRequest(request.id)}
                              className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                            >
                              Approve
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-400" />
                  Incident Logs & Response Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incidentLogs.map(incident => (
                    <div key={incident.id} className="p-4 bg-background/20 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-semibold">{incident.employee_name}</p>
                            <Badge className={getSeverityColor(incident.severity)}>
                              {incident.severity.toUpperCase()}
                            </Badge>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              {incident.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Incident Type: </span>
                              <span>{incident.incident_type}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Location: </span>
                              <span>{incident.location}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Response Time: </span>
                              <span className={incident.response_time <= 5 ? 'text-green-400' : incident.response_time <= 10 ? 'text-yellow-400' : 'text-red-400'}>
                                {incident.response_time} minutes
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Resolved: {incident.resolved_at}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-keeper-purple" />
                  Export Reports & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Health Reports</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Organization Wellness Summary (PDF)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Employee Health Trends (CSV)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Risk Assessment Report (PDF)
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Compliance Reports</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Access Log Report (CSV)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Incident Response Audit (PDF)
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Privacy Compliance Report (PDF)
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
