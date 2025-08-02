
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import Dashboard from '@/components/Dashboard';
import EmployeeDashboard from '@/components/EmployeeDashboard';
import HexaNurseDashboard from '@/components/HexaNurseDashboard';
import SecurityDashboard from '@/components/SecurityDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import AuthPage from '@/components/AuthPage';

const Index = () => {
  const { user, profile, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page: string) => {
    if (page === 'dashboard' && !user) {
      setCurrentPage('auth');
      return;
    }
    setCurrentPage(page);
  };

  const handleLogout = () => {
    setCurrentPage('home');
  };

  // Auto-navigate to dashboard when user logs in
  useEffect(() => {
    if (user && profile && currentPage === 'auth') {
      setCurrentPage('dashboard');
    }
  }, [user, profile, currentPage]);

  // Auto-navigate to auth when user logs out or no profile
  useEffect(() => {
    if (currentPage === 'dashboard' && (!user || !profile)) {
      setCurrentPage('auth');
    }
  }, [user, profile, currentPage]);

  if (loading) {
    return null; // AuthProvider handles loading state now
  }

  if (!user && currentPage === 'auth') {
    return <AuthPage />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        if (!profile?.role) {
          return (
            <div className="min-h-screen flex items-center justify-center bg-keeper-gradient">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-keeper-blue to-keeper-purple rounded-lg mx-auto mb-4 animate-glow"></div>
                <p className="text-glow">Setting up your dashboard...</p>
              </div>
            </div>
          );
        }
        
        switch (profile.role) {
          case 'admin':
            return <AdminDashboard />;
          case 'hexanurse':
            return <HexaNurseDashboard />;
          case 'security':
            return <SecurityDashboard />;
          case 'employee':
          default:
            return <EmployeeDashboard />;
        }
      case 'about':
        return <AboutSection />;
      case 'contact':
        return <ContactSection />;
      case 'auth':
        return <AuthPage />;
      case 'home':
      default:
        return <HeroSection onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-keeper-gradient">
      <Navigation 
        onNavigate={handleNavigate} 
        user={profile ? {
          name: profile.full_name,
          role: profile.role,
          empId: profile.employee_id
        } : null}
        onLogout={handleLogout} 
      />
      {renderCurrentPage()}
    </div>
  );
};

export default Index;
