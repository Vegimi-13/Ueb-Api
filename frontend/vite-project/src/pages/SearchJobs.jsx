import axios from "axios";
import { useState, useEffect } from "react";
export default function SearchJobs() {
const [jobs, setJobs]=useState([]);

  const fetchJobs=async()=>{
        try{
            const res=await axios.get("http://localhost:4002/jobs");
            setJobs(res.data);
        }catch(err){
            console.error(err);
            toast.error("Failed to fetch jobs");
        }
    };
    useEffect(()=>{
        fetchJobs();
    },[]);

   return (
   <div className="container mt-5">
      <h2 className="mb-4">Available Jobs</h2>
      {jobs.length === 0 && <p>No jobs available at the moment.</p>}

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
              <small>Type: {job.JobType.replace("_", " ")}</small>
            </div>
          </div>
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
