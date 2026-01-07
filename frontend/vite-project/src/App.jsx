import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayouts";
import SearchJobs from "./pages/SearchJobs";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CompanyDashboard from "./pages/company/Dashboard";
import CreateCategory from "./pages/admin/CreateCategory";
import Location from "./pages/admin/Location";
import Company from "./pages/company/Company";
import Jobs from "./pages/company/Job";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddApplication from "./pages/candidate/AddApplication";
import AddApplicationByAdmin from "./pages/admin/AddApplicationByAdmin";
import Applications from "./pages/admin/Applications";
import SearchJobsByCandidate from "./pages/candidate/SearchJobsByCandidate";
import CandidateApplications from "./pages/candidate/CandidateApplications";



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
        <Route path="/searchJobs" element={<SearchJobs />} />
        
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
    <Route path="applications" element={<Applications/>}/>
    <Route path="addApplicationByAdmin" element={<AddApplicationByAdmin/>}/>
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
       <Route path="addApplication/:jobId" element={<AddApplication/>}/>
       <Route path="searchJobsByCandidate" element={<SearchJobsByCandidate/>}/>
       <Route path="candidateApplications" element={<CandidateApplications/>}/>
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
    <Route path="jobs" element={<Jobs/>}/>
    
  </Route>

</Routes>
</>

  );
}

export default App;
