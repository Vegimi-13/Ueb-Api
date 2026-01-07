import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function OpenApplications(){
    
    const [formData,setFormData]=useState({
        title: "",
        description: "",
        salary: "",
        startTime: "",
        endTime: "",
        JobType: "",
        categoryId: "",
        locationId: ""
    });
    const [editingJob,setEditingJob]=useState(null);
    const [showEditModal,setShowEditModal]=useState(false);
    const [categories,setCategories]=useState([]);
    const [locations, setLocations]=useState([]);

    const [jobs, setJobs]=useState([]);
    const [jobId, setJobId]=useState(null);

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
    
            axios.get("http://localhost:4002/categories")
            .then(res=>setCategories(res.data))
            .catch(()=>toast.error("Failed to load categories."));
    
            axios.get("http://localhost:4002/locations")
            .then(res=>setLocations(res.data))
            .catch(()=>toast.error("Failed to load locations."));
        },[]);

  
    const handleChange=(e)=>{
        setFormData(prev=>({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleUpdate=async(e)=>{
        e.preventDefault();
        try{
            const payload={
                ...formData,
                salary: formData.salary? Number(formData.salary): null,
                categoryId: Number(formData.categoryId),
                locationId: Number(formData.locationId),
                
            };

            await axios.put(
                `http://localhost:4002/jobs/${editingJob.id}`,
                payload
            );
            toast.success("Job updated successfully");
            setShowEditModal(false);
            setEditingJob(null);
            fetchJobs();
        }catch (err) {
    console.error(err);
    toast.error("Failed to update job");
  }
    }

    const confirmDelete = (id) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p>Are you sure you want to delete this job application?</p>
        <p className="text-danger mb-2">This action cannot be undone.</p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-danger"
            onClick={async () => {
              try {
                
                await axios.delete(`http://localhost:4002/jobs/${id}`);
                toast.success("Job Application deleted successfully");
                fetchJobs();
                closeToast();
              } catch (err) {
                console.error(err);
                toast.error("Failed to delete job");
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
};

    
    return(
        <>
        <table className="table table-bordered mt-4">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Open Job Applications</th>
      
    </tr>
  </thead>
 
  <tbody>
    {jobs.length===0?(
        <tr>
            <td colSpan="2" className="text-center">
                No jobs found
            </td>
        </tr>
    ):(jobs.map((j,index)=>(
        <tr key={j.id}>
            <td>{index+1}</td>
            <td>{j.title}</td>
            <td>
           
              <button className="btn btn-outline-primary btn-sm w-50" title="Edit"
            style={{cursor: "pointer"}}
            onClick={()=>{
                setEditingJob(j);
                setFormData({
                    title: j.title,
                    description: j.description,
                    salary: j.salary ?? "",
                    startTime: j.startTime ?? "",
                    endTime: j.endTime ?? "",
                    JobType: j.JobType,
                    categoryId: j.categoryId,
                    locationId: j.locationId,
                })
                setShowEditModal(true);
                
            }}>Edit</button>
            </td>
            <td> <button type="button"
                className="btn btn-outline-danger btn-sm w-50" 
                onClick={() => confirmDelete(j.id)}>Delete</button>
         </td>
           
           
        </tr>
    )))}
    
   
    
  </tbody>
</table>
         {showEditModal&&(
            <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
            <h5 className="modal-title">Edit Job</h5>
            <button className="btn-close"
            onClick={()=>setShowEditModal(false)}/>
            </div>
            <form onSubmit={handleUpdate}>
                <div className="modal-body row g-2">

                     <div className="col-md-6">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Salary</label>
              <input
                type="number"
                name="salary"
                className="form-control"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                name="startTime"
                className="form-control"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">End Time</label>
              <input
                type="time"
                name="endTime"
                className="form-control"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Category</label>
              <select
                name="categoryId"
                className="form-control"
                value={formData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Location</label>
              <select
                name="locationId"
                className="form-control"
                value={formData.locationId}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-12">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">Job Type</label>
              <select
                name="JobType"
                className="form-control"
                value={formData.JobType}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
              </select>
            </div>
                
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={()=>setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Job</button>
            </div>
            </form>
            

            </div>
            </div>
            </div>
         )}

        </>
    );


}