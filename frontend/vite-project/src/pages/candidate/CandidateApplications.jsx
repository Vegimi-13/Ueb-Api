import axios from "axios";
import { useState, useEffect } from "react";

export default function CandidateApplications() {
  const [applications, setApplications] = useState([]);

      useEffect(() => {
    const fetchApplications = async () => {
      try {
        // 1️⃣ Get candidate applications
        const appsRes = await axios.get("http://localhost:4003/candidateApplications");
        const apps = appsRes.data;

        // 2️⃣ Fetch jobs for each application
        const appsWithJobs = await Promise.all(
          apps.map(async (app) => {
            const jobRes = await axios.get(`http://localhost:4002/jobs/${app.job_id}`);
            return {
              ...app,
              job: jobRes.data
            };
          })
        );

        setApplications(appsWithJobs);
      } catch (err) {
        console.error("Error fetching applications", err);
      }
    };
    
    fetchApplications();
  }, [])

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Job Applications</h2>

      {applications.length === 0 && <p>You have no applications yet.</p>}

      {applications.map((app) => (
        <div key={app.job.id} className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">{app.job.title}</h5>
            <h6 className="card-subtitle text-muted mb-2">{app.job.company.name}</h6>
            <p className="card-text">{app.job.description}</p>

            <div className="d-flex flex-wrap gap-3 text-muted">
              <small>Salary: {app.job.salary ? `€${app.job.salary}` : "Not specified"}</small>
              <small>Category: {app.job.category.name}</small>
              <small>Location: {app.job.location.name}</small>
              <small>Type: {app.job.JobType.replace("_", " ")}</small>
              <a href={app.resume_link}>Resume</a>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"end"}}>
            <button className="btn btn-primary px-4 mt-3">Edit</button>
            <button className="btn btn-danger px-4 mt-3">Delete</button>
            </div>
       </div>
      ))}
    </div>
  );
}
