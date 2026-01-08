import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function CandidateApplications() {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

function openEditModal(app) {
    setSelectedApp(app);
    setResumeFile(null);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setSelectedApp(null);
    setResumeFile(null);
  }

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const appsRes = await axios.get(
          "http://localhost:4003/candidateApplications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // 🔑 send token
          },
          params: { _: Date.now() }

        }
        );

        const appsWithJobs = await Promise.all(
          appsRes.data.map(async (app) => {
            const jobRes = await axios.get(
              `http://localhost:4002/jobs/${app.job_id}`
            );
            return { ...app, job: jobRes.data };
          })
        );
          console.log(appsWithJobs)
        setApplications(appsWithJobs);
      } catch (err) {
        console.error("Error fetching applications", err);
        toast.error('Fetching applications failed!')
      }
    };

    fetchApplications();
  }, []);

  
  

  async function saveResume() {
  if (!resumeFile) {
    alert("Please select a file to upload");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("resume", resumeFile);

    const res = await axios.patch(
      `http://localhost:4003/editResume/${selectedApp.application_id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Update state instantly
    setApplications((prev) =>
      prev.map((app) =>
        app.application_id === selectedApp.application_id
          ? { ...app, resume_path: res.data.updatedApplication.resume_path }
          : app
      )
    );
                
    closeModal();
     toast.success("Resume updated successfully!");
  
  } catch (err) {
    console.error("Error updating resume", err);
    toast.error("Updating resume failed.Please try again!");
    
  }
}


  function deleteApplication(id) {
    axios
      .delete(`http://localhost:4003/applications/${id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then(() => {
        setApplications((prev) =>
          prev.filter((app) => app.application_id !== id)
        );
             toast.success("Resume deleted successfully!");
      })
      .catch((err) => {
        console.error("Error deleting application", err);
        toast.error('Deleting resume failed.Please try again!')
      });
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Job Applications</h2>

      {applications.length === 0 && <p>You have no applications yet.</p>}

      {applications.map((app) => (
        <div key={app.application_id} className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">{app.job.title}</h5>
            <h6 className="card-subtitle text-muted mb-2">
              {app.job.company.name}
            </h6>

            <div className="d-flex flex-wrap gap-3 text-muted">
              <small>Category: {app.job.category.name}</small>
              
              <small>Location: {app.job.location.name}</small>
              <small>Type: {app.job.JobType.replace("_", " ")}</small>
              <small>
    Status:{" "}
    <span
      style={{
        fontWeight: "bold",
        color:
          app.status.name === "Applied"
            ? "blue"
            : app.status.name === "Interview Scheduled"
            ? "orange"
            : app.status.name === "Hired"
            ? "green"
            : app.status.name === "Rejected"
            ? "red"
            : "black",
      }}
    >
      {app.status.name}
    </span>
  </small>
              </div>
              
            <a
  href={`http://localhost:4003/uploads/${app.resume_path}`}
  target="_blank"
  rel="noopener noreferrer"
>
  View Resume
</a>

            
          </div>

          <div className="d-flex justify-content-end gap-2 p-3">
            <i className="bi bi-pencil-square" title="Edit"
            style={{cursor: "pointer"}} onClick={() => openEditModal(app)} />
            <i className="bi bi-trash3-fill" title="Delete" style={{cursor: "pointer"}}
            onClick={() => deleteApplication(app.application_id)}/>
          </div>
        </div>
      ))}

      {/* 🔽 MODAL */}
      {showModal && (
        <div className="modal fade show d-block" style={{ background: "#00000080" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Resume</h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>

              <div className="modal-body">
  <label className="form-label">Upload New Resume</label>
  <input
    type="file"
    className="form-control"
    onChange={(e) => setResumeFile(e.target.files[0])}
    accept=".pdf,.doc,.docx"
  />
</div>


              <div className="modal-footer">
  <button className="btn btn-secondary" onClick={closeModal}>
    Cancel
  </button>
  <button className="btn btn-success" onClick={saveResume}>
    Save
  </button>
</div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
