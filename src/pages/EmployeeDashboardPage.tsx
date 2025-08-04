import Navigation from '@/components/Navigation';
import EmployeeDashboard from '@/components/EmployeeDashboard';
import { useAuth } from '@/hooks/useAuth';

const EmployeeDashboardPage = () => {
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
      <EmployeeDashboard />
    </div>
  );
};

export default EmployeeDashboardPage;