import Hero from "../components/Hero";
import styles from "./Home.module.css";
import jobStyles from "./SearchJobs.module.css";
import useAuth from "../auth/useAuth";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import LatestJobs from "../components/LatestJobs";

export default function Home() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [latestJobs, setLatestJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        // Fetch latest 3 jobs
        axios.get("http://localhost:4002/jobs")
            .then(res => {
                setLatestJobs(res.data.slice(0, 3));
            })
            .catch(err => {
                console.error("Failed to load jobs:", err);
            });
    }, []);

    const handleApplyClick = (job) => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        if (user?.role === 'EMPLOYER') {
            return;
        }
        setSelectedJob(job);
    };

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleSubmitApplication = async () => {
        if (!resumeFile) {
            toast.error("Please upload your resume");
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("resume", resumeFile);
            formData.append("jobId", selectedJob.id);

            await axios.post(
                "http://localhost:4003/addApplications",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            toast.success("Application submitted!");
            setSelectedJob(null);
            setResumeFile(null);
            navigate("/candidate/candidateApplications");
        } catch (err) {
            if (err.response?.status === 409) {
                toast.error("You already applied for this job");
            } else {
                toast.error("Application failed. Please try again!");
            }
        } finally {
            setUploading(false);
        }
    };

    const getMyApplicationsLink = () => {
        if (isAuthenticated && user) {
            if (user.role === 'CANDIDATE') {
                return '/candidate/candidateApplications';
            }
        }
        return '/register';
    };

    const getPostJobLink = () => {
        if (isAuthenticated && user) {
            if (user.role === 'EMPLOYER') {
                return '/company/jobs';
            }
        }
        return '/register';
    };

    const getBrowseCandidatesLink = () => {
        if (isAuthenticated && user) {
            if (user.role === 'EMPLOYER') {
                return '/company/companyApplications';
            }
        }
        return '/register';
    };

    const getCandidateProfileLink = () => {
        if (isAuthenticated && user && user.role === 'CANDIDATE') {
            return '/candidate/profile';
        }
        return '/register';
    };

    const getCompanyProfileLink = () => {
        if (isAuthenticated && user && user.role === 'EMPLOYER') {
            return '/company/profile';
        }
        return '/register';
    };

    return (
        <div className="d-flex flex-column flex-grow-1 w-100">
            <Hero />
            
            {/* Featured Jobs Section */}
            <section className={styles.featuredJobsSection}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Featured Opportunities</h2>
                    <p className={styles.sectionSubtitle}>
                        Discover the latest job openings from top companies
                    </p>
                    
                    <div className={jobStyles.jobGrid}>
                        {latestJobs.map((job) => (
                            <div key={job.id} className={jobStyles.jobCard}>
                                <div className={jobStyles.cardBody}>
                                    <h5 className={jobStyles.jobTitle}>{job.title}</h5>
                                    <h6 className={jobStyles.companyName}>{job.company.name}</h6>
                                    
                                    <div className={jobStyles.jobDetails}>
                                        <div className={jobStyles.detailItem}>
                                            <span className={jobStyles.detailIcon}>💰</span>
                                            <span className={jobStyles.detailLabel}>Salary:</span>
                                            <span className={jobStyles.detailValue}>{job.salary ? `€${job.salary}` : "Not specified"}</span>
                                        </div>
                                        <div className={jobStyles.detailItem}>
                                            <span className={jobStyles.detailIcon}>📁</span>
                                            <span className={jobStyles.detailLabel}>Category:</span>
                                            <span className={jobStyles.detailValue}>{job.category.name}</span>
                                        </div>
                                        <div className={jobStyles.detailItem}>
                                            <span className={jobStyles.detailIcon}>📍</span>
                                            <span className={jobStyles.detailLabel}>Location:</span>
                                            <span className={jobStyles.detailValue}>{job.location.name}</span>
                                        </div>
                                        <div className={jobStyles.detailItem}>
                                            <span className={jobStyles.detailIcon}>💼</span>
                                            <span className={jobStyles.detailLabel}>Type:</span>
                                            <span className={jobStyles.detailValue}>{job.JobType ? job.JobType.replace("_", " ") : "Not specified"}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className={jobStyles.applyButton}
                                    onClick={() => handleApplyClick(job)}
                                    disabled={user?.role === 'EMPLOYER'}
                                    style={{
                                        opacity: user?.role === 'EMPLOYER' ? 0.5 : 1,
                                        cursor: user?.role === 'EMPLOYER' ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {user?.role === 'EMPLOYER' ? 'Not Available for Employers' : 'Apply Now'}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={styles.viewAllContainer}>
                        <a href="/searchJobs" className={styles.viewAllBtn}>
                            View All Jobs →
                        </a>
                    </div>
                </div>
            </section>
            
            {/* Features Section */}
            <section className={styles.featuresSection}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Why Choose Us?</h2>
                    <p className={styles.sectionSubtitle}>
                        Discover the best opportunities and connect with top companies
                    </p>
                    
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🎯</div>
                            <h3 className={styles.featureTitle}>Smart Matching</h3>
                            <p className={styles.featureDescription}>
                                Our AI-powered algorithm matches you with jobs that fit your skills and preferences perfectly.
                            </p>
                        </div>
                        
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>⚡</div>
                            <h3 className={styles.featureTitle}>Quick Apply</h3>
                            <p className={styles.featureDescription}>
                                Apply to multiple jobs in seconds with your saved profile and resume.
                            </p>
                        </div>
                        
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🏆</div>
                            <h3 className={styles.featureTitle}>Top Companies</h3>
                            <p className={styles.featureDescription}>
                                Access exclusive opportunities from leading companies across various industries.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className={styles.howItWorksSection}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>How It Works</h2>
                    <p className={styles.sectionSubtitle}>
                        Get hired in 4 simple steps
                    </p>
                    
                    <div className={styles.stepsGrid}>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNumber}>1</div>
                            <h4 className={styles.stepTitle}>Create Account</h4>
                            <p className={styles.stepDescription}>
                                Sign up for free and build your professional profile
                            </p>
                        </div>
                        
                        <div className={styles.stepCard}>
                            <div className={styles.stepNumber}>2</div>
                            <h4 className={styles.stepTitle}>Search Jobs</h4>
                            <p className={styles.stepDescription}>
                                Browse thousands of jobs matching your criteria
                            </p>
                        </div>
                        
                        <div className={styles.stepCard}>
                            <div className={styles.stepNumber}>3</div>
                            <h4 className={styles.stepTitle}>Apply Easily</h4>
                            <p className={styles.stepDescription}>
                                Submit your application with one click
                            </p>
                        </div>
                        
                        <div className={styles.stepCard}>
                            <div className={styles.stepNumber}>4</div>
                            <h4 className={styles.stepTitle}>Get Hired</h4>
                            <p className={styles.stepDescription}>
                                Connect with employers and land your dream job
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerGrid}>
                        <div>
                            <h3 className={styles.footerBrand}>FindJob</h3>
                            <p className={styles.footerDescription}>
                                Your gateway to amazing career opportunities. Connect with top employers and find your dream job today.
                            </p>
                            {isAuthenticated && user ? (
                                <p className={styles.footerUserInfo}>
                                    Logged in as: <strong>{user.role}</strong>
                                </p>
                            ) : (
                                <div className={styles.footerAuthButtons}>
                                    <a href="/login" className={styles.footerButton}>Login</a>
                                    <a href="/register" className={styles.footerButton}>Register</a>
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <h4 className={styles.footerTitle}>For Candidates</h4>
                            <ul className={styles.footerLinks}>
                                <li><a href="/searchJobs">Browse Jobs</a></li>
                                <li>
                                    <a href={getMyApplicationsLink()}>
                                        My Applications
                                    </a>
                                </li>
                                <li>
                                    <a href={getCandidateProfileLink()}>
                                        Profile
                                    </a>
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className={styles.footerTitle}>For Employers</h4>
                            <ul className={styles.footerLinks}>
                                <li>
                                    <a href={getPostJobLink()}>
                                        Post a Job
                                    </a>
                                </li>
                                <li>
                                    <a href={getBrowseCandidatesLink()}>
                                        Browse Candidates
                                    </a>
                                </li>
                                <li>
                                    <a href={getCompanyProfileLink()}>
                                        Profile
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className={styles.footerBottom}>
                        © 2026 FindJob. All rights reserved.
                    </div>
                </div>
            </footer>

            {/* Application Modal */}
            {selectedJob && (
                <div
                    className="modal fade show d-block"
                    style={{ background: "rgba(0,0,0,.5)" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5>Apply for {selectedJob.title}</h5>
                                <button className="btn-close" onClick={() => setSelectedJob(null)} />
                            </div>

                            <div className="modal-body">
                                <p><strong>Company:</strong> {selectedJob.company?.name}</p>
                                <p><strong>Category:</strong> {selectedJob.category?.name}</p>
                                <p><strong>Location:</strong> {selectedJob.location?.name}</p>
                                <p><strong>Salary:</strong> {selectedJob.salary ? `€${selectedJob.salary}` : "Not specified"}</p>
                                <p><strong>Type:</strong> {selectedJob.JobType?.replace("_", " ")}</p>
                                <p><strong>Description:</strong> {selectedJob.description}</p>

                                <div className="mb-3">
                                    <label className="form-label">Upload Resume (PDF)</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-success"
                                    disabled={uploading}
                                    onClick={handleSubmitApplication}
                                >
                                    {uploading ? "Uploading..." : "Submit Application"}
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedJob(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

