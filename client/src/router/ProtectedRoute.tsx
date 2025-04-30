import { useEffect, useState } from "react";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useAuth } from "../contexts/authContext";
import { Navigate, useLocation } from "react-router-dom";
import { checkAuth } from "../services/auth.service";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = "/",
}) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { signout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        setIsChecking(true);
        const user = await checkAuth();
        if (!user && isMounted) {
          setIsAuthenticated(false);
          signout();
        } else if (isMounted) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (isMounted) {
          setIsAuthenticated(false);
          signout();
        }
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };
    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  if (isChecking) {
    return (
      <div className="h-screen bg-gray-100">
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;