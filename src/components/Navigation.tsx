
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Shield, Heart, Users, UserCheck } from 'lucide-react';

interface User {
  name: string;
  role: 'employee' | 'admin' | 'hexanurse' | 'security';
  empId: string;
}

interface NavigationProps {
  onNavigate: (page: string) => void;
  user?: User | null;
  onLogout?: () => void;
}

const Navigation = ({ onNavigate, user, onLogout }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'hexanurse': return <Heart className="w-4 h-4" />;
      case 'security': return <UserCheck className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'hexanurse': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'security': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-keeper-blue/20 text-keeper-blue border-keeper-blue/30';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'hexanurse': return 'HexaNurse';
      case 'admin': return 'Admin';
      case 'security': return 'Security';
      default: return 'Employee';
    }
  };

  return (
    <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-8 h-8 bg-gradient-to-r from-keeper-blue to-keeper-purple rounded-lg mr-3 animate-glow"></div>
            <span className="text-xl font-bold text-glow">The Keeper</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('home')}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('about')}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              About
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('contact')}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              Contact
            </Button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  onClick={() => onNavigate('dashboard')}
                  className="text-keeper-blue hover:text-white hover:bg-keeper-blue/20"
                >
                  Dashboard
                </Button>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getRoleColor(user.role)} flex items-center gap-1`}>
                    {getRoleIcon(user.role)}
                    {getRoleDisplayName(user.role)}
                  </Badge>
                  <span className="text-white/80 text-sm">{user.name}</span>
                </div>
                <Button 
                  variant="outline" 
                  onClick={onLogout}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => onNavigate('auth')}
                className="bg-keeper-blue/20 text-keeper-blue hover:bg-keeper-blue/30 border border-keeper-blue/30"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Button 
              variant="ghost" 
              onClick={() => { onNavigate('home'); setIsMenuOpen(false); }}
              className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => { onNavigate('about'); setIsMenuOpen(false); }}
              className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
            >
              About
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => { onNavigate('contact'); setIsMenuOpen(false); }}
              className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
            >
              Contact
            </Button>
            
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => { onNavigate('dashboard'); setIsMenuOpen(false); }}
                  className="w-full justify-start text-keeper-blue hover:text-white hover:bg-keeper-blue/20"
                >
                  Dashboard
                </Button>
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getRoleColor(user.role)} flex items-center gap-1`}>
                      {getRoleIcon(user.role)}
                      {getRoleDisplayName(user.role)}
                    </Badge>
                    <span className="text-white/80 text-sm">{user.name}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => { onLogout?.(); setIsMenuOpen(false); }}
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => { onNavigate('auth'); setIsMenuOpen(false); }}
                className="w-full bg-keeper-blue/20 text-keeper-blue hover:bg-keeper-blue/30 border border-keeper-blue/30"
              >
                Login
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
