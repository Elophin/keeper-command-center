
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import Dashboard from '@/components/Dashboard';
import EmployeeDashboard from '@/components/EmployeeDashboard';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import LoginPage from '@/components/LoginPage';

interface User {
  name: string;
  role: 'admin' | 'employee';
  empId?: string;
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleNavigate = (page: string) => {
    if (page === 'dashboard' && !user) {
      setShowLogin(true);
      return;
    }
    setCurrentPage(page);
  };

  const handleLogin = (role: 'admin' | 'employee', userData: any) => {
    setUser({ ...userData, role });
    setShowLogin(false);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  if (showLogin) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        if (!user) {
          setShowLogin(true);
          return null;
        }
        return user.role === 'admin' ? <Dashboard /> : <EmployeeDashboard />;
      case 'about':
        return <AboutSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <HeroSection onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-keeper-gradient">
      <Navigation 
        onNavigate={handleNavigate} 
        user={user} 
        onLogout={handleLogout} 
      />
      {renderCurrentPage()}
    </div>
  );
};

export default Index;
