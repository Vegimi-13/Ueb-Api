import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center flex-grow-1 w-100">
      <h1 style={{ fontSize: "4rem", fontWeight: "700", marginBottom: "1rem" }}>
        Welcome to FindJob
      </h1>
      <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
        Search and apply for your dream job easily.
      </p>
      <Link to="/jobs" className="btn btn-primary btn-lg px-5">
        Search Jobs
      </Link>
    </div>
  );
}
