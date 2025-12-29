import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useAuth from "../auth/useAuth";

export default function DashboardLayout() {
  const { role } = useAuth();

  return (
    <div className="d-flex">
      <Sidebar role={role} />

      <div className="flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}
