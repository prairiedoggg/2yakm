import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface AuthenticatedRouteProps {
  element: React.ComponentType;
}

const AuthenticatedRoute = ({
  element: Component
}: AuthenticatedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log(token);

        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('사용자 인증 실패', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    return <div>로딩 중...</div>;
  }

  return isAuthenticated ? <Component /> : <Navigate to='/login' />;
};

export default AuthenticatedRoute;
