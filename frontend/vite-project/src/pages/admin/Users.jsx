import { useState, useEffect } from "react";
import api from "../../config/api";
import { toast } from "react-toastify";
import useAuth from "../../auth/useAuth";
import styles from "./Users.module.css";

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [editingProfile, setEditingProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/admin/users");
      // Filter out the current admin user
      const filteredUsers = response.data.filter(
        (user) => user.id !== currentUser?.id
      );
      setUsers(filteredUsers);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/auth/admin/users/${userId}`);
      toast.success("User deleted successfully");
      setUsers(users.filter((u) => u.id !== userId));
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete user");
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.patch(`/auth/admin/users/${userId}/role`, { role: newRole });
      toast.success("User role updated successfully");
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setEditingRoleId(null);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update role");
    }
  };

  const handleUpdateProfile = async (userId) => {
    try {
      await api.patch(`/auth/admin/users/${userId}`, editingProfile);
      toast.success("User profile updated successfully");
      setUsers(
        users.map((u) =>
          u.id === userId
            ? {
                ...u,
                firstName: editingProfile.firstName,
                lastName: editingProfile.lastName,
                email: editingProfile.email,
              }
            : u
        )
      );
      setEditingProfileId(null);
      setEditingProfile({ firstName: "", lastName: "", email: "" });
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to update profile"
      );
    }
  };

  const startEditingProfile = (user) => {
    setEditingProfileId(user.id);
    setEditingProfile({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "ADMIN":
        return `${styles.roleBadge} ${styles.roleAdmin}`;
      case "EMPLOYER":
        return `${styles.roleBadge} ${styles.roleEmployer}`;
      case "CANDIDATE":
        return `${styles.roleBadge} ${styles.roleCandidate}`;
      default:
        return styles.roleBadge;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.usersContainer}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.usersContainer}>
      <div className={styles.usersHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.usersTitle}>User Management</h1>
          <p className={styles.usersSubtitle}>
            Manage all users, roles, and permissions
          </p>
        </div>
      </div>

      <div className={styles.usersContent}>
        <div className={styles.tableControls}>
          <div className={styles.searchBox}>
            <svg
              className={styles.searchIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.resultsCount}>
            {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"} found
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    {editingProfileId === user.id ? (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input
                          type="text"
                          value={editingProfile.firstName}
                          onChange={(e) =>
                            setEditingProfile({
                              ...editingProfile,
                              firstName: e.target.value,
                            })
                          }
                          placeholder="First name"
                          className={styles.editInput}
                          style={{ flex: 1 }}
                        />
                        <input
                          type="text"
                          value={editingProfile.lastName}
                          onChange={(e) =>
                            setEditingProfile({
                              ...editingProfile,
                              lastName: e.target.value,
                            })
                          }
                          placeholder="Last name"
                          className={styles.editInput}
                          style={{ flex: 1 }}
                        />
                      </div>
                    ) : (
                      <div className={styles.userName}>
                        {user.firstName} {user.lastName}
                      </div>
                    )}
                  </td>
                  <td>
                    {editingProfileId === user.id ? (
                      <input
                        type="email"
                        value={editingProfile.email}
                        onChange={(e) =>
                          setEditingProfile({
                            ...editingProfile,
                            email: e.target.value,
                          })
                        }
                        placeholder="Email"
                        className={styles.editInput}
                      />
                    ) : (
                      <div className={styles.emailCell}>{user.email}</div>
                    )}
                  </td>
                  <td>
                    {editingRoleId === user.id ? (
                      <div className={styles.roleEditor}>
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className={styles.roleSelect}
                          autoFocus
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="EMPLOYER">Employer</option>
                          <option value="CANDIDATE">Candidate</option>
                        </select>
                        <button
                          onClick={() => handleUpdateRole(user.id, selectedRole)}
                          className={styles.saveBtn}
                          title="Save"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingRoleId(null)}
                          className={styles.cancelBtn}
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className={styles.roleCell}>
                        <span className={getRoleBadgeClass(user.role)}>
                          {user.role}
                        </span>
                      </div>
                    )}
                  </td>
                  <td>
                    <div className={styles.dateCell}>{formatDate(user.createdAt)}</div>
                  </td>
                  <td>
                    <div className={styles.actionsCell}>
                      {editingProfileId === user.id ? (
                        <>
                          <button
                            onClick={() => handleUpdateProfile(user.id)}
                            className={`${styles.actionBtn} ${styles.saveBtn}`}
                            title="Save Profile"
                          >
                            <i className="bi bi-check-circle"></i>
                          </button>
                          <button
                            onClick={() => {
                              setEditingProfileId(null);
                              setEditingProfile({
                                firstName: "",
                                lastName: "",
                                email: "",
                              });
                            }}
                            className={`${styles.actionBtn} ${styles.cancelBtn}`}
                            title="Cancel"
                          >
                            <i className="bi bi-x-circle"></i>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditingProfile(user)}
                            className={`${styles.actionBtn} ${styles.editBtn}`}
                            title="Edit Profile"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            onClick={() => {
                              setEditingRoleId(user.id);
                              setSelectedRole(user.role);
                            }}
                            className={`${styles.actionBtn} ${styles.editBtn}`}
                            title="Edit Role"
                          >
                            <i className="bi bi-shield-check"></i>
                          </button>
                          <button
                            onClick={() => openDeleteModal(user)}
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            title="Delete User"
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <h3>No users found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className={styles.pagination}>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.paginationBtn}
            >
              Previous
            </button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`${styles.pageBtn} ${
                    currentPage === page ? styles.activePage : ""
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.paginationBtn}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setDeleteModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Delete User</h2>
              <button
                className={styles.modalClose}
                onClick={() => setDeleteModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.warningIcon}>⚠️</div>
              <p>
                Are you sure you want to delete{" "}
                <strong>
                  {userToDelete?.firstName} {userToDelete?.lastName}
                </strong>
                ?
              </p>
              <p className={styles.warningText}>
                This action cannot be undone. All user data will be permanently
                removed.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={`${styles.modalBtn} ${styles.modalBtnCancel}`}
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`${styles.modalBtn} ${styles.modalBtnDelete}`}
                onClick={() => handleDeleteUser(userToDelete.id)}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
