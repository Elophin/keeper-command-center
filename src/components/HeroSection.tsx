
import { Button } from '@/components/ui/button';
import { Activity, Heart, Monitor } from 'lucide-react';

const HeroSection = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          {/* Floating icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 animate-float">
              <Activity className="w-8 h-8 text-keeper-blue/30" />
            </div>
            <div className="absolute top-1/3 right-1/4 animate-float delay-1000">
              <Heart className="w-6 h-6 text-keeper-purple/30" />
            </div>
            <div className="absolute bottom-1/3 left-1/3 animate-float delay-2000">
              <Monitor className="w-10 h-10 text-keeper-blue/20" />
            </div>
          </div>

          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-glow">
              <span className="bg-gradient-to-r from-keeper-blue to-keeper-purple bg-clip-text text-transparent">
                The Keeper
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-light">
              Revolutionizing Corporate Wellness & Access Control
            </p>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              A nano-sized, fashionable wearable device that combines health monitoring 
              with secure access control for the modern enterprise
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => onNavigate('dashboard')}
                className="bg-gradient-to-r from-keeper-blue to-keeper-purple hover:from-keeper-blue/80 hover:to-keeper-purple/80 text-white px-8 py-6 text-lg rounded-xl glow-effect transition-all duration-300"
              >
                View Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onNavigate('about')}
                className="border-keeper-blue/50 text-keeper-blue hover:bg-keeper-blue/10 px-8 py-6 text-lg rounded-xl transition-all duration-300"
              >
                Learn More
              </Button>
            </div>

            {/* Pilot project badge */}
            <div className="mt-12">
              <div className="glass-card inline-block px-6 py-3 rounded-full">
                <p className="text-sm text-muted-foreground">
                  Currently piloting at{' '}
                  <span className="text-keeper-blue font-semibold">Hexaware Technologies</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
