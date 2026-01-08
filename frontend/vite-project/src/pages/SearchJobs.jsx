import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function SearchJobs() {
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

  
  {jobs.map((job) => (
    <div key={job.id} className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{job.title}</h5>
        <h6 className="card-subtitle text-muted mb-2">{job.company.name}</h6>
        <p className="card-text">{job.description}</p>

        <div className="d-flex flex-wrap gap-3 text-muted">
          <small>Salary: {job.salary ? `€${job.salary}` : "Not specified"}</small>
          <small>Category: {job.category.name}</small>
          <small>Location: {job.location.name}</small>
          <small>Type: {job.JobType ? job.JobType.replace("_", " ") : "Not specified"}</small>
        </div>
      </div>
      <Link className="btn btn-primary px-4 mb-3" to="/login">Apply</Link>
    </div>
  ))}
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
      </div>
    </div>
  ))}
</div>*/ 



  
}
