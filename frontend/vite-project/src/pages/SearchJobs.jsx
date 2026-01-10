import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";
import styles from "./SearchJobs.module.css";


export default function SearchJobs() {
  const [selectedJob, setSelectedJob] = useState(null);
const [resumeFile, setResumeFile] = useState(null);
const [uploading, setUploading] = useState(false);

const navigate = useNavigate();
const { isAuthenticated, user } = useAuth();

const [jobs, setJobs]=useState([]);
const [filters,setFilters]=useState({
        search: "",
        categoryId: "",
        locationId: "",
        minSalary: "",
        maxSalary: "",
    });
const [categories,setCategories]=useState([]);
const [locations, setLocations]=useState([]);

   const handleFilterChange = (e) => {
  const { name, value } = e.target;

  const updatedFilters = {
    ...filters,
    [name]: value,
  };

  setFilters(updatedFilters);

  
  if (name === "search" && value === "") {
    fetchJobs(updatedFilters);
  }
};
const handleClearFilters = () => {
  const resetFilters = {
    search: "",
    categoryId: "",
    locationId: "",
    minSalary: "",
    maxSalary: "",
  };

  setFilters(resetFilters);
  fetchJobs(resetFilters); 
};



  const fetchJobs = async (overrideFilters = filters) => {
  const params = {};

  if (overrideFilters.categoryId) params.categoryId = overrideFilters.categoryId;
  if (overrideFilters.locationId) params.locationId = overrideFilters.locationId;
  if (overrideFilters.minSalary) params.minSalary = overrideFilters.minSalary;
  if (overrideFilters.maxSalary) params.maxSalary = overrideFilters.maxSalary;
  if (overrideFilters.search) params.search = overrideFilters.search;

  const res = await axios.get("http://localhost:4002/jobs", { params });
  setJobs(res.data);
};
    useEffect(()=>{
        
        axios.get("http://localhost:4002/categories")
            .then(res=>setCategories(res.data))
            .catch(()=>toast.error("Failed to load categories."));
    
            axios.get("http://localhost:4002/locations")
            .then(res=>setLocations(res.data))
            .catch(()=>toast.error("Failed to load locations."));
    },[]);
    useEffect(()=>{
        fetchJobs();
    },[]);
    const handleApplyClick = (job) => {
  if (!isAuthenticated) {
    navigate("/login");
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
    toast.error("Application failed. Please try again!");
  } finally {
    setUploading(false);
  }
};


   return (
   <div className="container mt-5">
  <h2 className="mb-4">Available Jobs</h2>

  {jobs.length === 0 && <p>No jobs available at the moment.</p>}

  {/* ===== Search + Filter Section ===== */}
  <div className="card p-3 mb-4 shadow-sm">
    <div className="row g-2 align-items-end">

     
      <div className="col-md-6">
        <label htmlFor="search" className="form-label">Search Jobs</label>
        <input
          type="text"
          id="search"
          name="search"
          className="form-control"
          placeholder="Search jobs by title..."
          value={filters.search || ""}
          onChange={handleFilterChange}
        />
      </div>

     
      <div className="col-md-3">
        <label htmlFor="categoryId" className="form-label">Category</label>
        <select
          id="categoryId"
          name="categoryId"
          className="form-select"
          value={filters.categoryId}
          onChange={handleFilterChange}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

    
      <div className="col-md-3">
        <label htmlFor="locationId" className="form-label">Location</label>
        <select
          id="locationId"
          name="locationId"
          className="form-select"
          value={filters.locationId}
          onChange={handleFilterChange}
        >
          <option value="">All Locations</option>
          {locations.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

     
      <div className="col-md-3 mt-3">
        <label htmlFor="minSalary" className="form-label">Min Salary</label>
        <input
          type="number"
          id="minSalary"
          name="minSalary"
          className="form-control"
          placeholder="Min Salary"
          value={filters.minSalary}
          onChange={handleFilterChange}
        />
      </div>

      <div className="col-md-3 mt-3">
        <label htmlFor="maxSalary" className="form-label">Max Salary</label>
        <input
          type="number"
          id="maxSalary"
          name="maxSalary"
          className="form-control"
          placeholder="Max Salary"
          value={filters.maxSalary}
          onChange={handleFilterChange}
        />
      </div>

      {/* Buttons */}
      <div className="col-12 mt-3 d-flex gap-2">
        <button className="btn btn-primary" onClick={() => fetchJobs()}>
          Apply Filters
        </button>
        <button className="btn btn-secondary" onClick={handleClearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  </div>

  
  <div className={styles.jobGrid}>
    {jobs.map((job) => (
      <div key={job.id} className={styles.jobCard}>
        <div className={styles.cardBody}>
          <h5 className={styles.jobTitle}>{job.title}</h5>
          <h6 className={styles.companyName}>{job.company.name}</h6>
          
          <div className={styles.jobDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>💰</span>
              <span className={styles.detailLabel}>Salary:</span>
              <span className={styles.detailValue}>{job.salary ? `€${job.salary}` : "Not specified"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>📁</span>
              <span className={styles.detailLabel}>Category:</span>
              <span className={styles.detailValue}>{job.category.name}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>📍</span>
              <span className={styles.detailLabel}>Location:</span>
              <span className={styles.detailValue}>{job.location.name}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailIcon}>💼</span>
              <span className={styles.detailLabel}>Type:</span>
              <span className={styles.detailValue}>{job.JobType ? job.JobType.replace("_", " ") : "Not specified"}</span>
            </div>
          </div>
        </div>
        <button
          className={styles.applyButton}
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

    /*
    <div className="row">
  {jobs.map(job => (
    <div key={job.id} className="col-md-4 mb-3 mt-5">
      <div className="card h-100">
        <div className="card-body">
          <h5 className="card-title">{job.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{job.company.name}</h6>
          <p className="card-text">{job.description}</p>
          <p className="card-text">
            <small>Salary: {job.salary ? `$${job.salary}` : "Not specified"}</small><br/>
            <small>Category: {job.category.name}</small><br/>
            <small>Location: {job.location.name}</small><br/>
            <small>Type: {job.JobType.replace("_", " ")}</small>
          </p>
        </div>
      )}
    </div>
  );*/
}
