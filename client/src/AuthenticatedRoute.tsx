import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface AuthenticatedRouteProps {
  element: React.ComponentType;
}

const AuthenticatedRoute = ({
  element: Component
}: AuthenticatedRouteProps) => {
  const token = Cookies.get('token');
  console.log('Token:', token);

  return token ? <Component /> : <Navigate to='/login' />;
};

export default AuthenticatedRoute;
