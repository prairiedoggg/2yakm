import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import refreshingToken from './components/authentication/refreshingToken';
import { useEffect, useState } from 'react';

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
        const token = Cookies.get('token');
        console.log(token);

        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        const refreshToken = Cookies.get('refreshToken');

        if (refreshToken) {
          try {
            await refreshingToken.post('/api/auth/token', { refreshToken });
            setIsAuthenticated(true);
          } catch (err) {
            console.error('Refresh token failed:', err);
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      }
    };

    checkAuthentication();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Component /> : <Navigate to='/login' />;
};

export default AuthenticatedRoute;
