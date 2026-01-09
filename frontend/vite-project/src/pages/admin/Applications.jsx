import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    fetchApplications();
    fetchStatuses();
  }, []);

  const filteredApplications = applications.filter((app) => {
  const term = searchTerm.toLowerCase();

  const email = app.candidate?.email?.toLowerCase() || "";
  const jobTitle = app.job?.title?.toLowerCase() || "";
  const companyName = app.job?.company?.name?.toLowerCase() || "";

  return (
    email.includes(term) ||
    jobTitle.includes(term) ||
    companyName.includes(term)
  );
});


  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:4003/applications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      const apps = res.data;

      // Fetch candidate and job details for each application
      const appsWithDetails = await Promise.all(
        apps.map(async (app) => {
          const jobRes = await axios.get(`http://localhost:4002/jobs/${app.job_id}`);
          const userRes = await axios.get(`http://localhost:4001/auth/users/${app.candidate_id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          });
          return { ...app, job: jobRes.data, candidate: userRes.data.user };
        })
      );
      setApplications(appsWithDetails);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch applications");
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await axios.get("http://localhost:4003/getStatus");
      setStatuses(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch statuses");
    }
  };

  const handleEditClick = (app) => {
    setSelectedApp(app);
    setSelectedStatus(app.status?.status_id || "");
    setShowModal(true);
  };
   function closeModal() {
    setShowModal(false);
    setSelectedApp(null);
    setResumeFile(null);
  }

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return toast.error("Please select a status");

    try {
      const res = await axios.patch(
        `http://localhost:4003/updateStatus/${selectedApp.application_id}`,
        { statusId: selectedStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );

      setApplications((prev) =>
        prev.map((app) =>
          app.application_id === selectedApp.application_id
            ? { ...app, status: res.data.updatedApp.status }
            : app
        )
      );

      toast.success("Status updated successfully!");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const deleteApplication = (id) => {
    axios
      .delete(`http://localhost:4003/applications/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      })
      .then(() => {
        setApplications(applications.filter((app) => app.application_id !== id));
        toast.success("Application deleted successfully!");
      })
      .catch(() => toast.error("Deleting application failed!"));
  };

  return (
    <>
      <h1>Applications</h1>
      <div className="mb-3">
  <input
    type="text"
    className="form-control"
    placeholder="Search by candidate email, job title or company..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Application_ID</th>
            <th>Candidate</th>
            <th>Job</th>
            <th>Company</th>
            <th>Resume Link</th>
            <th>Applied at</th>
            <th>Status</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredApplications.length > 0 ? (
  filteredApplications.map((app) => (
              <tr key={app.application_id}>
                <td>{app.application_id}</td>
                <td>{app.candidate?.email || "N/A"}</td>
                <td>{app.job?.title}</td>
                <td>{app.job?.company?.name}</td>
                <td>
                  <a href={`http://localhost:4003/uploads/${app.resume_path}`} target="_blank" rel="noreferrer">
                    View Resume
                  </a>
                </td>
                <td>{new Date(app.applied_at).toLocaleString()}</td>
                <td>
    <span
      style={{
        fontWeight: "bold",
        color:
          app.status?.name === "Applied"
            ? "blue"
            : app.status?.name === "Interview Scheduled"
            ? "orange"
            : app.status?.name === "Hired"
            ? "green"
            : app.status?.name === "Rejected"
            ? "red"
            : "black",
      }}
    >
      {app.status?.name || "N/A"}
    </span>
  </td>
                <td>
                  <i className="bi bi-pencil-square" style={{ cursor: "pointer" }} onClick={() => handleEditClick(app)} />
                </td>
                <td>
                  <i className="bi bi-trash3-fill" style={{ cursor: "pointer" }} onClick={() => deleteApplication(app.application_id)} />
                </td>
              </tr>
            ))
          ) : (
           <tr>
  <td colSpan="9" className="text-center">
    No applications found
  </td>
</tr>

          )}
        </tbody>
      </table>

      {/* Status Edit Modal */}
      {/* Status Edit Modal */}
{showModal && (
  <div className="modal fade show d-block" style={{ background: "#00000080" }}>
    <div className="modal-dialog">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h5 className="modal-title">Edit Status</h5>
          <button className="btn-close" onClick={closeModal}></button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <label className="form-label">Select New Status</label>
          <select
            className="form-select"
            value={selectedStatus || ""}
            onChange={(e) => setSelectedStatus(Number(e.target.value))}
          >
            <option value="">Choose status</option>
            {statuses.map((status) => (
              <option key={status.status_id} value={status.status_id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={closeModal}>
            Cancel
          </button>
          <button className="btn btn-success" onClick={handleStatusUpdate}>
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
}
