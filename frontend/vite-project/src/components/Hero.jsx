import { Link } from "react-router-dom";
import styles from "./Hero.module.css"; 
import useAuth from "../auth/useAuth";

export default function Hero() {
  const {isAuthenticated} = useAuth();
  return (
    <section className={styles.section}>
      {/* Decorative Blobs */}
      <div className={`${styles.blob} ${styles.blob1}`}></div>
      <div className={`${styles.blob} ${styles.blob2}`}></div>

      <div className="container position-relative">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className={styles.heroContent}>
              <span className={styles.badge}>
                🚀 #1 Job Board for Developers
              </span>
              
              <h1 className={styles.title}>
                Find your <span className={styles.gradientText}>dream job</span> with confidence
              </h1>
              
              <p className={styles.subtitle}>
                Connecting the best talent with top-tier companies. 
                Search thousands of active listings and launch your 
                career today.
              </p>

              <div className="d-flex gap-3 mb-5">
                <Link to="/searchJobs" className={styles.primaryBtn}>
                  Browse Jobs
                </Link>
                 {/* Only show Post a Job if user is NOT authenticated */}
  {!isAuthenticated && (
    <Link to="/register" className={styles.outlineBtn}>
      Post a Job
    </Link>
  )}
              </div>

              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <strong>10k+</strong>
                  <span>Active Jobs</span>
                </div>
                <div className={styles.statItem}>
                  <strong>500+</strong>
                  <span>Companies</span>
                </div>
                <div className={styles.statItem}>
                  <strong>1M+</strong>
                  <span>Candidates</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 d-none d-lg-block">
             <div className="position-relative">
                {/* We use a high quality illustration placeholder here */}
                {/* You can replace this with a real <img> tag later */}
                <img 
                    src="https://img.freepik.com/free-vector/job-hunt-concept-illustration_114360-446.jpg?t=st=1736344200~exp=1736347800~hmac=a82989eff7364177d643809633393933092070e5b7b6299839423c4cf70744e8&w=826" 
                    alt="Job Search Illustration" 
                    className="img-fluid"
                    style={{filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))", borderRadius: "20px"}}
                />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
