import { useState,useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function CompanyApplications(){

 /*   const [applications,setApplications] = useState([]);

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
*/
    return(
      <>

        <h1>Applications</h1>

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
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                     </tr>
                    </thead>
                    
                    <tbody>
                <th>1111</th>
                    </tbody>
            </table>


 </>
    );
};