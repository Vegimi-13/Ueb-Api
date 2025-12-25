import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CompanyDashboard from "./pages/company/CompanyDashboard";

function App() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute allowed={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="admin" element={<AdminDashboard />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowed={["candidate"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="candidate" element={<CandidateDashboard />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowed={["company"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="company" element={<CompanyDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
