import { useState,useEffect } from "react";
import { toast } from "react-toastify";

import axios from "axios";
export default function Company(){

    const token = localStorage.getItem("accessToken");


    

  
   
    const[formData,setFormData]=useState({
        name: "",
        description: "",
        website: "",
        numberOfEmployees: "",
    });
    const [companyId,setCompanyId]=useState(null);

   
    useEffect(()=>{
        axios.get("http://localhost:4002/companies/me",{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
        .then(res=>{
            

                setFormData({
                name: res.data.name,
                description: res.data.description|| "",
                website: res.data.website|| "",
                numberOfEmployees: res.data.numberOfEmployees|| "",
            });
            setCompanyId(res.data.id);
            
            
        })
        .catch(err=>{
            console.log("No company yet,create one");
        })
    },[]);

    const handleChange=(e)=>{
        setFormData(prev=>({...prev,[e.target.name]: e.target.value}));
    }
    const handleSubmit=async(e)=>{
   
    e.preventDefault();
    try{
        const payload={
            ...formData,
            numberOfEmployees: formData.numberOfEmployees? Number(formData.numberOfEmployees)
            : null,
        };
        if(companyId){
            const res= await axios.put(`http://localhost:4002/companies/${companyId}`,payload, {
             headers: {
      Authorization: `Bearer ${token}`,
    }
     }
          );
            toast.success("Company updated successfully");
            setFormData(res.data);

        }else{
            const res=await axios.post("http://localhost:4002/companies",payload,
                {
             headers: {
      Authorization: `Bearer ${token}`,
    }
     }
          
            );
            toast.success("Company created successfully!");
            setFormData(res.data);
            setCompanyId(res.data.id);
        }
    }catch(err){
        console.error(err);
        toast.error("Failed to save company data");
    }
    };

    const confirmDelete=()=>{
        toast(
            ({closeToast})=>(
                <div>
                    <p>Are you sure you want to delete your company?</p>
                    <p className="text-danger mb-2">
                        This action cannot be undone.
                    </p>
                    <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-danger"
                    onClick={async()=>{
                        try{
                            await axios.delete(`http://localhost:4002/companies/${companyId}`,
                                {
             headers: {
      Authorization: `Bearer ${token}`,
    }
     }
          
                            );

                            toast.success("Company deleted successfully");

                            setCompanyId(null);
                            setFormData({
                                name: "",
                                description: "",
                                website: "",
                                numberOfEmployees: "",
                            });
                            closeToast();
                        }catch(err){
                            console.error(err);
                            toast.error("Failed to delete company");
                        }
                    }}>Delete</button>
                    <button className="btn btn-sm btn-secondary"
                    onClick={closeToast}>Cancel</button>
                    </div>
                </div>
            ),
            {autoClose: false}
        );
    };

   


    return(
         <>
         <div>
            
        <form onSubmit={handleSubmit}>
            <h3>{companyId? "Edit your company data":"Register your company"}</h3>
  <div className="mb-3">
    <label htmlFor="company" className="form-label">Company Name</label>
    <input type="text" className="form-control" id="company" aria-describedby="company" required
    name="name" value={formData.name}
onChange={handleChange}
/>
    
  </div>
  <div className="mb-3">
    <label htmlFor="description" className="form-label">Description </label>
    <input type="text" className="form-control" id="description" aria-describedby="description" required
    name="description" value={formData.description}
onChange={handleChange}
/>
    
  </div>
   <div className="mb-3">
    <label htmlFor="website" className="form-label">Website </label>
    <input type="text" className="form-control" id="website" aria-describedby="website" required
    name="website" value={formData.website}
onChange={handleChange}
/>
    
  </div>
   <div className="mb-3">
    <label htmlFor="numberOfEmployees" className="form-label">Number Of Employees </label>
    <input type="number" className="form-control" id="numberOfEmployees" aria-describedby="numberOfEmployees" required
    name="numberOfEmployees" value={formData.numberOfEmployees}
onChange={handleChange}
/>
    
  </div>
  
  <button type="submit" className="btn btn-primary">{companyId ? "Edit your Company Data" : "Register your Company"}</button>
</form>
{companyId&& (
    <button type="button"
    className="btn btn-danger ms-2 mt-4" onClick={confirmDelete}>Delete Company</button>
)}

</div>




 </>
    );
   


}