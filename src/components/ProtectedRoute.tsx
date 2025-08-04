import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/utils/roleUtils';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  // Show loading state while authentication is being verified
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-keeper-gradient">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-keeper-blue to-keeper-purple rounded-lg mx-auto mb-4 animate-glow"></div>
          <p className="text-glow">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to login if no profile (shouldn't happen but safety check)
  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is allowed for this route
  if (!allowedRoles.includes(profile.role as UserRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;