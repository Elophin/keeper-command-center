
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Heart, Monitor, User } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Heart,
      title: 'Health Monitoring',
      description: 'Real-time tracking of pulse, blood pressure, SpO₂, and temperature with advanced ESP32 processing.'
    },
    {
      icon: Monitor,
      title: 'Access Control',
      description: 'Secure NFC/RFID technology replaces traditional ID cards with encrypted authentication.'
    },
    {
      icon: Activity,
      title: 'Cloud Communication',
      description: 'Secure BLE/Wi-Fi connectivity ensures real-time data synchronization and monitoring.'
    },
    {
      icon: User,
      title: 'Enterprise Ready',
      description: 'Designed for corporate environments with admin dashboards and comprehensive reporting.'
    }
  ];

  return (
    <div className="min-h-screen pt-20 px-4 pb-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-glow mb-4">
            About The Keeper
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A revolutionary nano-sized wearable device that seamlessly integrates health monitoring 
            with secure access control for the modern corporate environment.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card hover:glow-effect transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-keeper-blue to-keeper-purple rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technical Architecture */}
        <Card className="glass-card mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-glow">Technical Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-keeper-blue mb-3">Hardware</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>ESP32 Microprocessor</li>
                  <li>Multi-sensor Array</li>
                  <li>NFC/RFID Module</li>
                  <li>Wireless Charging</li>
                  <li>Long-life Battery</li>
                </ul>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-keeper-purple mb-3">Connectivity</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Secure BLE 5.0</li>
                  <li>Wi-Fi 802.11 b/g/n</li>
                  <li>Encrypted Data Transfer</li>
                  <li>Real-time Sync</li>
                  <li>Cloud Integration</li>
                </ul>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Software</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>React Dashboard</li>
                  <li>Real-time Analytics</li>
                  <li>JWT Authentication</li>
                  <li>Data Encryption</li>
                  <li>Report Generation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hexaware Pilot */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-glow">Hexaware Technologies Pilot</CardTitle>
            <CardDescription className="text-center text-lg">
              Currently being tested in a real corporate environment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-keeper-blue mb-2">500+</div>
                <div className="text-muted-foreground">Active Devices</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-keeper-purple mb-2">24/7</div>
                <div className="text-muted-foreground">Monitoring</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
                <div className="text-muted-foreground">Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutSection;
