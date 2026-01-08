import { Navigate } from "react-router-dom";
import useAuth from "../auth/useAuth";

const ROLE_DASHBOARD_MAP = {
  ADMIN: "/admin",
  CANDIDATE: "/candidate",
  EMPLOYER: "/company",
};

export default function GuestRoute({ children }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    // If we have a role map, use it, otherwise default to home or dashboard
    const redirectPath = ROLE_DASHBOARD_MAP[role] || "/";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
