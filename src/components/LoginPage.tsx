
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, User, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: 'admin' | 'employee', userData: any) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'employee'>('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - in real app, this would call an API
    if (activeTab === 'admin' && credentials.username === 'admin' && credentials.password === 'admin123') {
      onLogin('admin', { name: 'System Administrator', role: 'admin' });
    } else if (activeTab === 'employee' && credentials.username === 'employee' && credentials.password === 'emp123') {
      onLogin('employee', { name: 'John Doe', empId: 'EMP001', role: 'employee' });
    } else {
      alert('Invalid credentials. Try admin/admin123 or employee/emp123');
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
          <p className="text-muted-foreground">Secure Access Portal</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Choose your login type and enter credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Role Selection Tabs */}
            <div className="flex mb-6 bg-background/20 rounded-lg p-1">
              <button
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                  activeTab === 'employee' 
                    ? 'bg-keeper-blue/20 text-keeper-blue border border-keeper-blue/30' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('employee')}
              >
                <User className="w-4 h-4" />
                Employee
              </button>
              <button
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                  activeTab === 'admin' 
                    ? 'bg-keeper-purple/20 text-keeper-purple border border-keeper-purple/30' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('admin')}
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {activeTab === 'admin' ? 'Admin Username' : 'Employee ID'}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-keeper-blue/50"
                  placeholder={activeTab === 'admin' ? 'Enter admin username' : 'Enter employee ID'}
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 pr-10 bg-background/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-keeper-blue/50"
                    placeholder="Enter password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
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
                className={`w-full ${
                  activeTab === 'admin' 
                    ? 'bg-keeper-purple/20 text-keeper-purple hover:bg-keeper-purple/30 border border-keeper-purple/30'
                    : 'bg-keeper-blue/20 text-keeper-blue hover:bg-keeper-blue/30 border border-keeper-blue/30'
                }`}
              >
                {activeTab === 'admin' ? 'Admin Login' : 'Employee Login'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-background/20 rounded-lg">
              <h4 className="text-sm font-semibold mb-2 text-center">Demo Credentials</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <Badge className="bg-keeper-purple/20 text-keeper-purple">Admin</Badge>
                  <span className="font-mono">admin / admin123</span>
                </div>
                <div className="flex justify-between items-center">
                  <Badge className="bg-keeper-blue/20 text-keeper-blue">Employee</Badge>
                  <span className="font-mono">employee / emp123</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Secure authentication powered by The Keeper</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
