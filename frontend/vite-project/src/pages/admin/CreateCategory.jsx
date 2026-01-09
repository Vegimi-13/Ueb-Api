import { useState,useEffect } from "react";
import { toast } from "react-toastify";

import axios from "axios";
export default function CreateCategory(){
    

  
    const[categoryName, setCategoryName]=useState("");
    const [categories, setCategories]=useState([]);
    const [editingId,setEditingId]=useState(null);
    const [editingName,setEditingName]=useState("");

   

const handleSubmit=async(e)=>{
   
    e.preventDefault();
    try{
        await axios.post(`http://localhost:4002/categories`,  { name: categoryName });
        toast.success("Category created successfully");
        setCategoryName("");
        fetchCategories();
    }catch (error) {
  if (error.response?.status === 409) {
    toast.error("Category already exists");
  } else {
    toast.error("Error creating category");
  }
}

}

const fetchCategories=()=>{
    axios.get("http://localhost:4002/categories")
  .then(res => {
    setCategories(res.data)
    console.log(res.data); 
  })
  .catch(err => {
    console.error(err);
  });

}
useEffect(()=>{
    fetchCategories();
},[]);

const handleUpdate=async (id)=>{
    if(!editingName.trim()){
        toast.warning("Category name cannot be empty");
        return;
    }
    try{
        await axios.put(`http://localhost:4002/categories/${id}`,{
            name: editingName,
        });

        setEditingId(null);
        fetchCategories();
        toast.success("Category updated successfully!")
    }catch(error){
        if(error.response?.status===409){
            toast.error("Category alredy exists");
        }else{
            toast.error("Error updating category");
        }
    }
}
const deleteCategories= async (id)=>{
    try{
        await axios.delete(`http://localhost:4002/categories/${id}`)
        fetchCategories();
        toast.success("Category deleted successfully!");

    }catch(error){
        toast.error("Error deleting category!");

    }
    
}
const confirmDeletion = (id) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p>Are you sure you want to delete this category?</p>
        <div className="d-flex gap-2 mt-2">
          <button
            className="btn btn-sm btn-danger"
            onClick={() => {
              deleteCategories(id);
              closeToast();
            }}
          >
            Delete
          </button>
          <button
            className="btn btn-sm btn-secondary"
            onClick={closeToast}
          >
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
        <div style={{ maxWidth: '95vw', margin: '0 auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
  <div className="mb-3">
    <label htmlFor="category" className="form-label">Category Name</label>
    <input type="text" className="form-control" id="category" aria-describedby="category" required
    name="name" value={categoryName}
onChange={(e) => setCategoryName(e.target.value)}
/>
    
  </div>
  
  <button type="submit" className="btn btn-primary">Add Category</button>
</form>
<table className="table table-bordered mt-4" style={{ marginBottom: '1rem' }}>
  <thead style={{ backgroundColor: '#f8f9fa' }}>
    <tr>
      <th scope="col" style={{ padding: '1rem', fontWeight: '600', width: '5%' }}>#</th>
      <th scope="col" style={{ padding: '1rem', fontWeight: '600', width: '70%' }}>Category Name</th>
      <th scope="col" style={{ padding: '1rem', fontWeight: '600', width: '25%' }}>Actions</th>
    </tr>
  </thead>
 
  <tbody>
    {categories.length===0?(
        <tr>
            <td colSpan="3" className="text-center" style={{ padding: '1rem' }}>
                No categories found
            </td>
        </tr>
    ):(categories.map((c,index)=>(
        <tr key={c.id}>
            <td style={{ padding: '1rem', width: '5%' }}>{index+1}</td>
            <td style={{ padding: '1rem', width: '70%' }}>{editingId===c.id?(

                <input type="text" className="form-control"
                value={editingName}
                onChange={(e)=>setEditingName(e.target.value)}/>
            ):(c.name)}</td>
            <td style={{ padding: '1rem', width: '25%' }}>
            {editingId===c.id?(
                <>
                <button className="btn btn-sm btn-success me-2"
                onClick={()=>handleUpdate(c.id)}>Save</button>
                <button className="btn btn-sm btn-secondary"
                onClick={()=>setEditingId(null)}>Cancel</button>
                </>
            ):(
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <i className="bi bi-pencil-square" title="Edit"
                style={{cursor: "pointer"}}
                onClick={()=>{
                    setEditingId(c.id);
                    setEditingName(c.name);
                }}/>
                <i className="bi bi-trash3-fill" title="Delete" style={{cursor: "pointer"}}
                onClick={()=>confirmDeletion(c.id)}/>
              </div>
            )}
            </td>
        </tr>
    )))}
    
   
    
  </tbody>
</table>
        </div>
 </>
    );
   


}