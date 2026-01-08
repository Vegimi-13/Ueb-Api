import { Link } from "react-router-dom";
import useAuth from "../auth/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light shadow-sm"
      style={{ padding: "1.5rem 2rem" }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-3" to="/">
          FindJob
        </Link>
        <div className="d-flex ms-auto gap-3">
          {!isAuthenticated ? (
            <>
              <Link className="btn btn-outline-primary px-4 fw-semibold" to="/register">
                Register
              </Link>
              <Link className="btn btn-primary px-4 fw-semibold" to="/login">
                Login
              </Link>
            </>
          ) : (
            <div className="dropdown">
              <button
                className="btn border-0 shadow-none dropdown-toggle fw-medium"
                style={{ backgroundColor: 'transparent' }}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                >
                {user?.firstName || "User"}
              </button>

              <ul className="dropdown-menu dropdown-menu-end shadow">

                <li className="px-3 py-2 border-bottom">
                  <p className="mb-0 fw-bold">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <small className="text-muted">{user?.email}</small>
                </li>

                <li>
                  <Link
                    className="dropdown-item"
                    to={
                      user.role === "ADMIN"
                        ? "/admin"
                        : user.role === "EMPLOYER"
                          ? "/company"
                          : "/candidate"
                    }
                  >
                    <i className="bi bi-speedometer2 me-2"></i> Dashboard
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item"
                    to={
                      user.role === "ADMIN"
                        ? "/admin/profile"
                        : user.role === "EMPLOYER"
                          ? "/company/profile"
                          : "/candidate/profile"
                    }
                  >
                    <i className="bi bi-person me-2"></i> My Profile
                  </Link>
                </li>

                <li><hr className="dropdown-divider" /></li>

                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={logout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
