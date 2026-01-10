import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./CandidateApplications.module.css";

export default function CandidateApplications() {
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this application?</p>
          <p className="text-danger mb-2">This action cannot be undone.</p>
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-danger"
              onClick={async () => {
                try {
                  await axios.delete(`http://localhost:4003/applications/${id}`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                  });
                  setApplications((prev) =>
                    prev.filter((app) => app.application_id !== id)
                  );
                  toast.success("Application deleted successfully!");
                  closeToast();
                } catch (err) {
                  console.error("Error deleting application", err);
                  toast.error("Deleting application failed. Please try again!");
                }
              }}
            >
              Delete
            </button>
            <button className="btn btn-sm btn-secondary" onClick={closeToast}>
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Job Applications</h1>
      </div>

      {applications.length === 0 && (
        <div className={styles.emptyState}>
          <p>You have no applications yet.</p>
        </div>
      )}

      {applications.length > 0 && (
        <>
          <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Job Title</th>
                <th>Company</th>
                <th>Category</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th>Resume</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((app, index) => {
                  const getStatusClass = (statusName) => {
                    switch (statusName) {
                      case "Applied":
                        return styles.statusApplied;
                      case "Interview Scheduled":
                        return styles.statusInterview;
                      case "Hired":
                        return styles.statusHired;
                      case "Rejected":
                        return styles.statusRejected;
                      default:
                        return styles.statusApplied;
                    }
                  };

                  return (
                    <tr key={app.application_id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td><strong>{app.job.title}</strong></td>
                      <td>{app.job.company.name}</td>
                      <td>{app.job.category.name}</td>
                      <td>{app.job.location.name}</td>
                      <td>{app.job.JobType.replace("_", " ")}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${getStatusClass(app.status.name)}`}>
                          {app.status.name}
                        </span>
                      </td>
                      <td>
                        <a
                          href={`http://localhost:4003/uploads/${app.resume_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.resumeLink}
                        >
                          View Resume
                        </a>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <i
                            className={`bi bi-pencil-square ${styles.actionIcon} ${styles.editIcon}`}
                            title="Edit Resume"
                            onClick={() => openEditModal(app)}
                          />
                          <i
                            className={`bi bi-trash3-fill ${styles.actionIcon} ${styles.deleteIcon}`}
                            title="Delete Application"
                            onClick={() => deleteApplication(app.application_id)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {/* Pagination */}
          {applications.length > itemsPerPage && (
            <div className={styles.pagination}>
              <button
                className={styles.pageButton}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              {Array.from(
                { length: Math.ceil(applications.length / itemsPerPage) },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  className={`${styles.pageButton} ${currentPage === page ? styles.active : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className={styles.pageButton}
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, Math.ceil(applications.length / itemsPerPage))
                  )
                }
                disabled={currentPage === Math.ceil(applications.length / itemsPerPage)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

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
