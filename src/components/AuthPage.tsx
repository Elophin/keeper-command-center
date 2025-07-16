
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, User, Eye, EyeOff, UserPlus, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createDemoUsers } from '@/utils/setupDemoUsers';

const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    employee_id: '',
    role: 'employee' as 'employee' | 'admin' | 'hexanurse' | 'security',
    department: '',
    phone: '',
    emergency_contact: '',
    floor_number: '',
    office_location: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await signIn(loginData.email, loginData.password);
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    await signUp(signupData.email, signupData.password, {
      full_name: signupData.full_name,
      employee_id: signupData.employee_id,
      role: signupData.role,
      department: signupData.department,
      phone: signupData.phone,
      emergency_contact: signupData.emergency_contact,
      floor_number: signupData.floor_number ? parseInt(signupData.floor_number) : undefined,
      office_location: signupData.office_location,
    });
    
    setLoading(false);
  };

  const handleSetupDemoUsers = async () => {
    setSetupLoading(true);
    await createDemoUsers();
    setSetupLoading(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'hexanurse': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'security': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-keeper-blue/20 text-keeper-blue border-keeper-blue/30';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-keeper-gradient">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-keeper-blue to-keeper-purple rounded-lg mr-3 animate-glow"></div>
            <span className="text-3xl font-bold text-glow">The Keeper</span>
          </div>
          <p className="text-muted-foreground">Seconds matter. So do lives.</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-center">Authentication</CardTitle>
            <CardDescription className="text-center">
              Secure access for healthcare professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-keeper-blue/20 text-keeper-blue hover:bg-keeper-blue/30 border border-keeper-blue/30"
                    disabled={loading}
                  >
                    <User className="w-4 h-4 mr-2" />
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-background/20 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold">Demo Setup</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSetupDemoUsers}
                      disabled={setupLoading}
                      className="text-xs"
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      {setupLoading ? 'Setting up...' : 'Setup Demo Users'}
                    </Button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <Badge className="bg-red-500/20 text-red-400">Admin</Badge>
                      <span className="font-mono">admin@company.com</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge className="bg-green-500/20 text-green-400">HexaNurse</Badge>
                      <span className="font-mono">nurse@company.com</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge className="bg-orange-500/20 text-orange-400">Security</Badge>
                      <span className="font-mono">security@company.com</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge className="bg-keeper-blue/20 text-keeper-blue">Employee</Badge>
                      <span className="font-mono">john.doe@company.com</span>
                    </div>
                    <p className="text-center text-muted-foreground mt-2">Password: password123</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signup-email">Email *</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="employee-id">Employee ID *</Label>
                      <Input
                        id="employee-id"
                        value={signupData.employee_id}
                        onChange={(e) => setSignupData(prev => ({ ...prev, employee_id: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="full-name">Full Name *</Label>
                    <Input
                      id="full-name"
                      value={signupData.full_name}
                      onChange={(e) => setSignupData(prev => ({ ...prev, full_name: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Role *</Label>
                    <Select value={signupData.role} onValueChange={(value) => setSignupData(prev => ({ ...prev, role: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="hexanurse">HexaNurse</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={signupData.department}
                        onChange={(e) => setSignupData(prev => ({ ...prev, department: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="floor">Floor Number</Label>
                      <Input
                        id="floor"
                        type="number"
                        value={signupData.floor_number}
                        onChange={(e) => setSignupData(prev => ({ ...prev, floor_number: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="office">Office Location</Label>
                    <Input
                      id="office"
                      value={signupData.office_location}
                      onChange={(e) => setSignupData(prev => ({ ...prev, office_location: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signup-password">Password *</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupData.password}
                        onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirm Password *</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className={`w-full ${getRoleColor(signupData.role)}`}
                    disabled={loading}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Secure healthcare management powered by The Keeper</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
