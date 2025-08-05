import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Shield, Heart, UserCheck, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createDemoUsers } from '@/utils/setupDemoUsers';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  // Sign up form states
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    emergencyContact: ''
  });

  const { signIn, signUp, user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user && profile) {
      navigate(`/${profile.role}-dashboard`, { replace: true });
    }
  }, [user, profile, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (!error) {
        toast({
          title: "Login Successful",
          description: "Welcome back to The Keeper!",
        });
        // Navigation will be handled by the useEffect above
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(signUpData.email, signUpData.password, {
        full_name: signUpData.fullName,
        phone: signUpData.phone,
        emergency_contact: signUpData.emergencyContact,
      });
      
      if (!error) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created. Please check your email for verification.",
        });
        setActiveTab('login');
        setEmail(signUpData.email);
      }
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    {
      role: 'Admin',
      email: 'admin@admin.hexaware.com',
      icon: Shield,
      color: 'text-red-500',
      description: 'Full system access'
    },
    {
      role: 'HexaNurse',
      email: 'nurse@nurse.hexaware.com',
      icon: Heart,
      color: 'text-green-500',
      description: 'Medical monitoring'
    },
    {
      role: 'Security',
      email: 'security@security.hexaware.com',
      icon: UserCheck,
      color: 'text-blue-500',
      description: 'Security operations'
    },
    {
      role: 'Employee',
      email: 'employee@employee.hexaware.com',
      icon: Users,
      color: 'text-purple-500',
      description: 'Personal dashboard'
    }
  ];

  const fillDemoCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setActiveTab('login');
  };

  const handleSetupDemoUsers = async () => {
    setLoading(true);
    toast({
      title: "Setting up demo users...",
      description: "This may take a moment.",
    });

    try {
      await createDemoUsers();
      toast({
        title: "Demo Users Created",
        description: "You can now log in with any of the demo accounts using password 'demo123'.",
      });
    } catch (error) {
      console.error('Error setting up demo users:', error);
      toast({
        title: "Setup Failed",
        description: "Failed to create demo users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-keeper-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left">
          <div className="mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-keeper-blue via-keeper-purple to-keeper-cyan bg-clip-text text-transparent mb-4">
              The Keeper
            </h1>
            <p className="text-xl text-keeper-gray/80 mb-8">
              Advanced Health Monitoring & Safety Management System
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-keeper-blue mb-4">Demo Accounts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  onClick={() => fillDemoCredentials(account.email)}
                  className="p-4 bg-background/10 backdrop-blur-sm border border-keeper-blue/20 rounded-lg hover:bg-background/20 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <account.icon className={`w-5 h-5 ${account.color}`} />
                    <div className="text-left">
                      <p className="font-medium text-keeper-blue">{account.role}</p>
                      <p className="text-xs text-keeper-gray/60">{account.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <Button 
              onClick={handleSetupDemoUsers}
              disabled={loading}
              variant="outline"
              className="w-full mt-4"
            >
              {loading ? 'Setting up...' : 'Setup Demo Users'}
            </Button>
          </div>
        </div>

        {/* Right side - Auth Forms */}
        <Card className="bg-background/95 backdrop-blur-sm border-keeper-blue/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            <CardDescription>
              Sign in to access your dashboard or create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@hexaware.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@hexaware.com"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm password"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={signUpData.phone}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency-contact">Emergency Contact (Optional)</Label>
                      <Input
                        id="emergency-contact"
                        type="tel"
                        placeholder="+1 (555) 987-6543"
                        value={signUpData.emergencyContact}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;