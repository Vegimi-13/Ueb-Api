import { Link } from "react-router-dom";
import useAuth from "../auth/useAuth";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-2">
      <div className="container">
        <Link className={`navbar-brand fw-bold fs-3 ${styles.brand}`} to="/">
          FindJob
        </Link>
        
        <button 
          className={`navbar-toggler ${styles.burgerBtn}`}
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="d-flex ms-auto gap-3 align-items-center">
            {!isAuthenticated ? (
              <>
                <Link className={styles.outlineBtn} to="/register">
                  Register
                </Link>
                <Link className={styles.primaryBtn} to="/login">
                  Login
                </Link>
              </>
            ) : (
              <div className="dropdown">
                <button
                  className={`btn shadow-none dropdown-toggle d-flex align-items-center gap-2 ${styles.userBtn}`}
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className={styles.userAvatar}>
                    {user?.firstName?.charAt(0) || "U"}
                  </div>
                  <span className="fw-medium text-dark">{user?.firstName || "User"}</span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
                  <li className="px-3 py-2 border-bottom" style={{ paddingLeft: 'calc(1rem + 1.5em)' }}>
                    <p className="mb-0 fw-bold text-dark">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <small className="text-muted">{user?.email}</small>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item py-2"
                      to={
                        user.role === "ADMIN"
                          ? "/admin"
                          : user.role === "EMPLOYER"
                            ? "/company"
                            : "/candidate"
                      }
                    >
                      <i className="bi bi-speedometer2 me-2 text-primary"></i> Dashboard
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item py-2"
                      to={
                        user.role === "ADMIN"
                          ? "/admin/profile"
                          : user.role === "EMPLOYER"
                            ? "/company/profile"
                            : "/candidate/profile"
                      }
                    >
                      <i className="bi bi-person me-2 text-primary"></i> My Profile
                    </Link>
                  </li>

                  <li><hr className="dropdown-divider" /></li>

                  <li>
                    <button
                      className="dropdown-item text-danger py-2"
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
      </div>
    </nav>
  );
}
