import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useAuth from "../auth/useAuth";

export default function DashboardLayout() {
  const { role } = useAuth();

  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar role={role} />

      <div className="flex-grow-1" style={{ overflow: 'hidden', height: '100vh' }}>
        <Outlet />
      </div>
    </div>
  );
}
