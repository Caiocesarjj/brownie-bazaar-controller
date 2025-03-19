
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (adminOnly && !isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, navigate, adminOnly]);
  
  if (!user) {
    return null;
  }
  
  if (adminOnly && !isAdmin) {
    return null;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
