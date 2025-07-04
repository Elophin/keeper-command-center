
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    alert('Thank you for your interest! We will contact you soon.');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-glow mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground">
            Ready to revolutionize your corporate wellness and security?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl">Get Started</CardTitle>
              <CardDescription>
                Contact us to learn more about implementing The Keeper in your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-background/50 border-keeper-blue/30 focus:border-keeper-blue"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-background/50 border-keeper-blue/30 focus:border-keeper-blue"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="bg-background/50 border-keeper-blue/30 focus:border-keeper-blue"
                  />
                </div>
                <div>
                  <Textarea
                    name="message"
                    placeholder="Tell us about your requirements"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="bg-background/50 border-keeper-blue/30 focus:border-keeper-blue"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-keeper-blue to-keeper-purple hover:from-keeper-blue/80 hover:to-keeper-purple/80 text-white py-6 text-lg glow-effect"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Business Value Proposition</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-keeper-blue rounded-full mt-2 flex-shrink-0"></div>
                    <span>Reduce healthcare costs through preventive monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-keeper-purple rounded-full mt-2 flex-shrink-0"></div>
                    <span>Enhance workplace security with seamless access control</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Improve employee wellness and productivity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Real-time insights and comprehensive reporting</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="text-keeper-blue font-semibold">Health Monitoring</div>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Heart Rate</li>
                      <li>• Blood Pressure</li>
                      <li>• SpO₂ Levels</li>
                      <li>• Temperature</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="text-keeper-purple font-semibold">Access Control</div>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• NFC/RFID</li>
                      <li>• Secure Entry</li>
                      <li>• Access Logs</li>
                      <li>• Real-time Alerts</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Pilot Success</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-keeper-blue mb-2">Hexaware Technologies</div>
                  <div className="text-muted-foreground">
                    Successfully piloting with 500+ employees across multiple locations
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
