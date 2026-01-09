import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export default function Location() {
  const [locationName, setLocationName] = useState("");
  const [locations, setLocations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:4002/locations`, {
        name: locationName,
      });
      toast.success("Location created successfully");
      setLocationName("");
      fetchLocations();
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Location already exists");
      } else {
        toast.error("Error creating location");
      }
    }
  };

  const fetchLocations = () => {
    axios
      .get("http://localhost:4002/locations")
      .then((res) => {
        setLocations(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    fetchLocations();
  }, []);

  const handleUpdate = async (id) => {
    if (!editingName.trim()) {
      toast.warning("Location name cannot be empty");
      return;
    }
    try {
      await axios.put(`http://localhost:4002/locations/${id}`, {
        name: editingName,
      });

      setEditingId(null);
      toast.success("Location updated successfully!");
      fetchLocations();
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Location already exists");
      } else {
        toast.error("Error updating location");
      }
    }
  };
  const deleteLocation = async (id) => {
    try {
      await axios.delete(`http://localhost:4002/locations/${id}`);
      fetchLocations();
    } catch (error) {
      console.eror(error);
      toast.error("Error deleting location!");
    }
  };
  const confirmDeletion = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this location?</p>
          <div className="d-flex gap-2 mt-2">
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                deleteLocation(id);
                closeToast();
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
  return (
    <>
      <div
        style={{
          maxWidth: "95vw",
          margin: "0 auto",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Location Name
            </label>
            <input
              type="text"
              className="form-control"
              id="location"
              aria-describedby="location"
              required
              name="name"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Add Location
          </button>
        </form>
        <table
          className="table table-bordered mt-4"
          style={{ marginBottom: "1rem" }}
        >
          <thead style={{ backgroundColor: "#f8f9fa" }}>
            <tr>
              <th
                scope="col"
                style={{ padding: "1rem", fontWeight: "600", width: "5%" }}
              >
                #
              </th>
              <th
                scope="col"
                style={{ padding: "1rem", fontWeight: "600", width: "70%" }}
              >
                Location Name
              </th>
              <th
                scope="col"
                style={{ padding: "1rem", fontWeight: "600", width: "25%" }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {locations.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="text-center"
                  style={{ padding: "1rem" }}
                >
                  No locations found
                </td>
              </tr>
            ) : (
              locations.map((l, index) => (
                <tr key={l.id}>
                  <td style={{ padding: "1rem", width: "5%" }}>{index + 1}</td>
                  <td style={{ padding: "1rem", width: "70%" }}>
                    {editingId === l.id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                      />
                    ) : (
                      l.name
                    )}
                  </td>
                  <td style={{ padding: "1rem", width: "25%" }}>
                    {editingId === l.id ? (
                      <>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleUpdate(l.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <i
                          className="bi bi-pencil-square"
                          title="Edit"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setEditingId(l.id);
                            setEditingName(l.name);
                          }}
                        />
                        <i
                          className="bi bi-trash3-fill"
                          title="Delete"
                          style={{ cursor: "pointer" }}
                          onClick={() => confirmDeletion(l.id)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
