import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayouts";

import AdminDashboard from "./pages/admin/AdminDashboard";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CompanyDashboard from "./pages/company/Dashboard";
import CreateCategory from "./pages/admin/CreateCategory";
import Location from "./pages/admin/Location";
import Company from "./pages/company/Company";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




function App() {
  return (
    <>
     <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
      />
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
    <Route path="category" element={<CreateCategory/>}/>
    <Route path="location" element={<Location/>}/>
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
    <Route path="registerCompany" element={<Company/>}/>
    
  </Route>

</Routes>
</>

  );
}

export default App;
