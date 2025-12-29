import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayouts";

import AdminDashboard from "./pages/admin/AdminDashboard";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import Home from "./pages/Home";

function App() {
  return (
   <Routes>

  {/* PUBLIC ROUTES */}
  <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        
      </Route>

  
 

  {/* ADMIN */}
  <Route
    path="/admin/*"
    element={
      <ProtectedRoute allowed={["admin"]}>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<AdminDashboard />} />
  </Route>

  {/* CANDIDATE */}
  <Route
    path="/candidate/*"
    element={
      <ProtectedRoute allowed={["candidate"]}>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<CandidateDashboard />} />
  </Route>

  {/* COMPANY */}
  <Route
    path="/company/*"
    element={
      <ProtectedRoute allowed={["company"]}>
        <DashboardLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<CompanyDashboard />} />
  </Route>

</Routes>

  );
}

export default App;
