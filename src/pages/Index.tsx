
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (user && profile && !loading) {
      navigate(`/${profile.role}-dashboard`, { replace: true });
    }
  }, [user, profile, loading, navigate]);

  // Show loading while checking authentication
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

  // If user is authenticated but still on landing page, don't show navigation
  if (user && profile) {
    return null; // Will redirect via useEffect
  }

  const handleNavigate = (page: string) => {
    if (page === 'login' || page === 'auth') {
      navigate('/login');
    }
    // For other navigation, we can implement section scrolling later
  };

  return (
    <div className="min-h-screen bg-keeper-gradient">
      <HeroSection onNavigate={handleNavigate} />
      <AboutSection />
      <ContactSection />
    </div>
  );
};

export default Index;
