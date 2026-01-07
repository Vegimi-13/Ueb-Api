import { useState,useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";



export default function Applications(){

    const [applications,setApplications] = useState([]);

    useEffect(() => {
  axios.get("http://localhost:4003/applications")
    .then(async (res) => {
      const apps = res.data;

      // Fetch jobs for each application
      const appsWithJobs = await Promise.all(
        apps.map(async (app) => {
          const jobRes = await axios.get(`http://localhost:4002/jobs/${app.job_id}`);
          return {
            ...app,
            job: jobRes.data
          };
        })
      );
      console.log(appsWithJobs);
      setApplications(appsWithJobs);
    })
    .catch((err) => {
      console.error("Error fetching applications", err);
    });
}, []);
   
  function deleteApplication(id){
     axios
    .delete(`http://localhost:4003/applications/${id}`,)
    .then(() => {
      // Remove deleted application from state
      setApplications(applications.filter(app => app.application_id !== id));
    })
    .catch(err => {
      console.error("Error deleting application", err);
    });
  }

    return(
      <>

        <h1>Applications</h1>
          <td>
            <Link to='/admin/addApplicationByAdmin'>
                <button class="btn btn-primary btn-sm" >Add New Application</button>  
            </Link>
          </td>

         <table className="table table-bordered mt-4">
                    <thead>
                     <tr>
                        <th scope="col">Application_ID</th>
                        <th scope="col">Candidate</th>
                        <th scope="col">Job</th>
                        <th scope="col">Company</th>
                        <th scope="col">Resume Link</th>
                        <th scope="col">Applied at</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                     </tr>
                    </thead>
                    
                    <tbody>
                         {applications.length > 0 ? (
            applications.map((app) => (
              <tr key={app.application_id}>
                <td>{app.application_id}</td>
                <td>{app.candidate_id}</td>
                <td>{app.job.title}</td>
                <td>{app.job.company.name}</td>
                <td>
                  <a href={app.resume_link} target="_blank" rel="noreferrer">
                    View Resume
                  </a>
                </td>
                <td>{new Date(app.applied_at).toLocaleString()}</td>
                <td>{app.status.name}</td>
                <td>
    <button class="btn btn-primary btn-sm">Edit</button>
    <button class="btn btn-danger btn-sm" onClick={() => deleteApplication(app.application_id)}>Delete</button>
</td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No applications found
              </td>
            </tr>
          )}
                    </tbody>
            </table>


 </>
    );
};