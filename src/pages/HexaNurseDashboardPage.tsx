import Navigation from '@/components/Navigation';
import HexaNurseDashboard from '@/components/HexaNurseDashboard';
import { useAuth } from '@/hooks/useAuth';

const HexaNurseDashboardPage = () => {
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-keeper-gradient">
      <Navigation 
        onNavigate={() => {}} // Not needed for dashboard pages
        user={profile ? {
          name: profile.full_name,
          role: profile.role,
          empId: profile.employee_id
        } : null}
        onLogout={handleLogout} 
      />
      <HexaNurseDashboard />
    </div>
  );
};

export default HexaNurseDashboardPage;