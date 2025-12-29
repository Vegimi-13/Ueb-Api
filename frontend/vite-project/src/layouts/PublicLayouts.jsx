import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PublicLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
     
      <div className="flex-grow-1 d-flex flex-column">
        <Outlet />
      </div>
    </div>
  );
}
