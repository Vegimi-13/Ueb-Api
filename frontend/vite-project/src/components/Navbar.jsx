import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm" style={{ padding: "1.5rem 2rem" }}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-3" to="/">FindJob</Link>
        <div className="d-flex ms-auto gap-3">
          <Link className="btn btn-outline-primary px-4" to="/register">Register</Link>
          <Link className="btn btn-primary px-4" to="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}
