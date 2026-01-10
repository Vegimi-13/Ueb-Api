import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Jobs(){

    const token = localStorage.getItem("accessToken");


    const [jobs, setJobs]=useState([]);
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
    
    const [categories,setCategories]=useState([]);
    const [locations, setLocations]=useState([]);

    const fetchJobs=async()=>{
        try{
            const res=await axios.get("http://localhost:4002/jobs")
            setJobs(res.data);
        }catch(err){
            console.error(err);
            toast.error("Failed to fetch jobs");
        }
    };
    useEffect(()=>{
        fetchJobs();

        axios.get("http://localhost:4002/categories",)
        .then(res=>setCategories(res.data))
        .catch(()=>toast.error("Failed to load categories."));

        axios.get("http://localhost:4002/locations",)
        .then(res=>setLocations(res.data))
        .catch(()=>toast.error("Failed to load locations."), );
    },[]);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{

          const payload = {
            ...formData,
            salary: formData.salary ? Number(formData.salary) : null,
            categoryId: Number(formData.categoryId),
            locationId: Number(formData.locationId),
};

           await axios.post("http://localhost:4002/jobs",payload,
            {
             headers: {
      Authorization: `Bearer ${token}`,
    }
     }
          
           );
            
            toast.success("Job created successfully!");
            setFormData({
                title: "",
                description: "",
                salary: "",
                startTime: "",
                endTime: "",
                JobType: "",
                categoryId: "",
                locationId: "",
             });
            fetchJobs();
            


        }catch(err){
            console.error(err);
            toast.error("Failed to create job.");
        }

    }
    const handleChange=(e)=>{
        setFormData(prev=>({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    return(
        <>
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
         <form onSubmit={handleSubmit} className="p-3 border rounded mt-5">
  <div className="row g-2">
    <div className="col-md-6">
      <label htmlFor="title" className="form-label">Job Title</label>
      <input
        type="text"
        className="form-control form-control-sm"
        id="title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />
    </div>

    <div className="col-md-6">
      <label htmlFor="salary" className="form-label">Salary</label>
      <input
        type="number"
        className="form-control form-control-sm"
        id="salary"
        name="salary"
        value={formData.salary}
        onChange={handleChange}
      />
    </div>

    <div className="col-md-6">
      <label htmlFor="startTime" className="form-label">Start Time</label>
      <input
        type="time"
        className="form-control form-control-sm"
        id="startTime"
        name="startTime"
        value={formData.startTime}
        onChange={handleChange}
      />
    </div>

    <div className="col-md-6">
      <label htmlFor="endTime" className="form-label">End Time</label>
      <input
        type="time"
        className="form-control form-control-sm"
        id="endTime"
        name="endTime"
        value={formData.endTime}
        onChange={handleChange}
      />
    </div>

    <div className="col-md-6">
      <label htmlFor="categoryId" className="form-label">Category</label>
      <select
        className="form-control form-control-sm"
        name="categoryId"
        value={formData.categoryId}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>

    <div className="col-md-6">
      <label htmlFor="locationId" className="form-label">Location</label>
      <select
        className="form-control form-control-sm"
        name="locationId"
        value={formData.locationId}
        onChange={handleChange}
        required
      >
        <option value="">Select Location</option>
        {locations.map(l => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>
    </div>

    <div className="col-md-12">
      <label htmlFor="description" className="form-label">Description</label>
      <textarea
        type="text"
        className="form-control form-control-sm"
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />
    </div>

    <div className="col-md-12">
      <label htmlFor="JobType" className="form-label">Job Type</label>
      <select
        className="form-control form-control-sm"
        name="JobType"
        value={formData.JobType}
        onChange={handleChange}
        required
      >
        <option value="">Select Job Type</option>
        <option value="FULL_TIME">Full Time</option>
        <option value="PART_TIME">Part Time</option>
      </select>
    </div>

    <div  class="d-grid gap-2 col-6 mx-auto">
      <div class="d-grid gap-2">
  <button class="btn btn-primary" type="submit">Add Job</button>
 
</div>
    </div>
  </div>
</form>
</div>
        </>
    );


}