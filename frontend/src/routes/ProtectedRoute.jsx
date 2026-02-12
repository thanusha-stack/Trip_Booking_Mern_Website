import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Wait until user state is restored
  if (loading) return <div className="text-center mt-5">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to home if user role is not allowed
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
