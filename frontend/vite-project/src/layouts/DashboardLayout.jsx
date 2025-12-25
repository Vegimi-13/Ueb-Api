import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div>
      <h2>Dashboard Layout Header</h2>
      <Outlet /> {/* Page content appears here */}
    </div>
  );
}
