import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import PublicLayout from "./layouts/PublicLayouts";
import SearchJobs from "./pages/SearchJobs";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CompanyDashboard from "./pages/company/Dashboard";
import CreateCategory from "./pages/admin/CreateCategory";
import Location from "./pages/admin/Location";
import Company from "./pages/company/Company";
import Jobs from "./pages/company/Job";
import OpenApplications from "./pages/company/OpenApplications";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddApplication from "./pages/candidate/AddApplication";
import AddApplicationByAdmin from "./pages/admin/AddApplicationByAdmin";
import Applications from "./pages/admin/Applications";
import SearchJobsByCandidate from "./pages/candidate/SearchJobsByCandidate";
import CandidateApplications from "./pages/candidate/CandidateApplications";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/User/Profile";


function App() {
  return (
    <AuthProvider >
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
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        </Route>




        {/* ADMIN */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowed={["ADMIN"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="category" element={<CreateCategory />} />
          <Route path="location" element={<Location />} />
          <Route path="profile" element={<Profile />} />
          <Route path="applications" element={<Applications />} />
          <Route path="addApplicationByAdmin" element={<AddApplicationByAdmin />} />
        </Route>

        {/* CANDIDATE */}
        <Route
          path="/candidate/*"
          element={
            <ProtectedRoute allowed={["CANDIDATE"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CandidateDashboard />} />
          <Route path="addApplication/:jobId" element={<AddApplication />} />
          <Route path="searchJobsByCandidate" element={<SearchJobsByCandidate />} />
          <Route path="profile" element={<Profile />} />
          <Route path="candidateApplications" element={<CandidateApplications />} />
        </Route>

        {/* COMPANY */}
        <Route
          path="/company/*"
          element={
            <ProtectedRoute allowed={["EMPLOYER"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CompanyDashboard />} />
          <Route path="registerCompany" element={<Company />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="profile" element={<Profile />} />
          <Route path="openApplications" element={<OpenApplications />} />

        </Route>


        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>

  );
}

export default App;
