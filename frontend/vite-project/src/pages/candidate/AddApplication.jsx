import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddApplication() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [resumeLink, setResumeLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeLink.trim()) {
      toast.warning("Resume link is required");
      return;
    }

    try {
      setLoading(true);
        console.log(resumeLink);
        console.log(jobId);
      await axios.post("http://localhost:4003/addApplications", {
        jobId: Number(jobId),
        resumeLink
      });

      toast.success("Application submitted!");
      navigate("/candidate/jobs");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("You already applied for this job");
      } else if (error.response?.status === 401) {
        toast.error("Please login first");
      } else {
        toast.error("Failed to apply");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Apply for Job</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Resume Link</label>
          <input
            type="url"
            className="form-control"
            placeholder="https://drive.google.com/..."
            value={resumeLink}
            onChange={(e) => setResumeLink(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
