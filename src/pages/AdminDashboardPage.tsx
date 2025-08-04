import Navigation from '@/components/Navigation';
import AdminDashboard from '@/components/AdminDashboard';
import { useAuth } from '@/hooks/useAuth';

const AdminDashboardPage = () => {
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
      <AdminDashboard />
    </div>
  );
};

export default AdminDashboardPage;