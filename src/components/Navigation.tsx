
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, User, LogOut, Shield } from 'lucide-react';

interface User {
  name: string;
  role: 'admin' | 'employee';
  empId?: string;
}

interface NavigationProps {
  onNavigate: (page: string) => void;
  user?: User | null;
  onLogout?: () => void;
}

const Navigation = ({ onNavigate, user, onLogout }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard', id: 'dashboard' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b border-keeper-blue/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-keeper-blue to-keeper-purple rounded-lg mr-3 animate-glow"></div>
              <span className="text-xl font-bold text-glow">The Keeper</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="text-foreground hover:text-keeper-blue transition-colors duration-200 font-medium"
              >
                {item.name}
              </button>
            ))}

            {/* User Info & Logout */}
            {user && (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
                <div className="flex items-center gap-2">
                  {user.role === 'admin' ? (
                    <Shield className="w-4 h-4 text-keeper-purple" />
                  ) : (
                    <User className="w-4 h-4 text-keeper-blue" />
                  )}
                  <span className="text-sm font-medium">{user.name}</span>
                  <Badge 
                    className={
                      user.role === 'admin' 
                        ? 'bg-keeper-purple/20 text-keeper-purple border-keeper-purple/30' 
                        : 'bg-keeper-blue/20 text-keeper-blue border-keeper-blue/30'
                    }
                  >
                    {user.role}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                  className="block px-3 py-2 text-base font-medium text-foreground hover:text-keeper-blue transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile User Info & Logout */}
              {user && (
                <div className="border-t border-white/10 pt-3 mt-3">
                  <div className="flex items-center gap-2 px-3 py-2">
                    {user.role === 'admin' ? (
                      <Shield className="w-4 h-4 text-keeper-purple" />
                    ) : (
                      <User className="w-4 h-4 text-keeper-blue" />
                    )}
                    <span className="text-sm font-medium">{user.name}</span>
                    <Badge 
                      className={
                        user.role === 'admin' 
                          ? 'bg-keeper-purple/20 text-keeper-purple border-keeper-purple/30' 
                          : 'bg-keeper-blue/20 text-keeper-blue border-keeper-blue/30'
                      }
                    >
                      {user.role}
                    </Badge>
                  </div>
                  <button
                    onClick={() => {
                      onLogout?.();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
