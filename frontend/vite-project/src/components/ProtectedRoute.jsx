import { Navigate } from "react-router-dom";
import useAuth from "../auth/useAuth";

export default function ProtectedRoute({ allowed, children }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowed.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
