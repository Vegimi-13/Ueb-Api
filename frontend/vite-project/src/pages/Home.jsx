import { Link } from "react-router-dom";
import useAuth from "../auth/useAuth";

export default function Home() {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="d-flex flex-column justify-content-center align-items-center text-center flex-grow-1 w-100 py-5">
            <h1 className="display-1 fw-bold mb-3">
                Welcome to FindJob
            </h1>
            <p className="lead fs-3 mb-5 text-muted">
                {isAuthenticated
                    ? `Hello, ${user?.firstName}! Ready to find your next opportunity?`
                    : "Search and apply for your dream job easily."}
            </p>

            <div className="d-flex gap-3">
                {!isAuthenticated ? (
                    <>
                        <Link to="/searchJobs" className="btn btn-primary btn-lg px-5 py-3 fw-bold">
                            Search Jobs
                        </Link>
                        <Link to="/login" className="btn btn-outline-primary btn-lg px-5 py-3 fw-bold">
                            Login
                        </Link>
                    </>
                ) : (
                    <Link to={user.role === "ADMIN" ? "/admin" : user.role === "EMPLOYER" ? "/company" : "/candidate"}
                        className="btn btn-primary btn-lg px-5 py-3 fw-bold">
                        Go to Dashboard
                    </Link>
                )}
            </div>
        </div>
    );
}

