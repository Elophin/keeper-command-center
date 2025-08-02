
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

  // Redirect authenticated users from auth page
  useEffect(() => {
    if (user && currentPage === 'auth') {
      setCurrentPage('dashboard');
    }
  }, [user, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-keeper-gradient">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-keeper-blue to-keeper-purple rounded-lg mx-auto mb-4 animate-glow"></div>
          <p className="text-glow">Loading The Keeper...</p>
        </div>
      </div>
    );
  }

  if (!user && currentPage === 'auth') {
    return <AuthPage />;
  }

  const renderCurrentPage = () => {
    console.log('renderCurrentPage - currentPage:', currentPage, 'user:', !!user, 'profile:', !!profile);
    
    switch (currentPage) {
      case 'dashboard':
        if (!user || !profile) {
          console.log('No user or profile, redirecting to auth. User:', !!user, 'Profile:', !!profile);
          setCurrentPage('auth');
          return null;
        }
        
        console.log('Routing to dashboard for role:', profile.role);
        // Route to appropriate dashboard based on user role
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
