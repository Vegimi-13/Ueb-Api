import { useState, useEffect } from "react";
import useAuth from "../../auth/useAuth";
import api from "../../config/api";
import { toast } from "react-toastify";
import styles from "./profile.module.css";

export default function Profile() {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === "firstName" || name === "lastName") {
            // Auto-capitalize first letter of each word
            value = value.replace(/\b\w/g, (char) => char.toUpperCase());
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.patch("/auth/profile", {
                firstName: formData.firstName,
                lastName: formData.lastName,
            });
            setUser(res.data.user);
            toast.success("Profile updated successfully!");
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className={styles.container}>
            <div className={styles.profileCard}>
                <div className={`${styles.banner} ${styles[`${user.role}_banner`]}`}></div>

                <div className={styles.profileInfo}>
                    <div className={styles.headerRow}>
                        <div className={styles.userBlock}>
                            <div className={styles.avatar}>
                                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </div>


                        </div>


                    </div>

                    <form onSubmit={handleSubmit} className={styles.details}>
                        <div className={styles.mainInfo}>
                            <h3 className={styles.sectionTitle}>
                                <i className="bi bi-person-fill"></i> Personal Information
                            </h3>

                            <div className={styles.inputGroup}>
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    className={styles.input}
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    className={styles.input}
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    className={styles.input}
                                    value={formData.email}
                                    disabled
                                    title="Email cannot be changed"
                                />
                                <small className="text-muted mt-2 d-block">
                                    <i className="bi bi-info-circle me-1"></i> Contact support to change your email.
                                </small>
                            </div>

                            <button type="submit" className={styles.saveBtn} disabled={loading}>
                                {loading ? "Saving Changes..." : "Save Profile Details"}
                            </button>
                        </div>

                        <div className={styles.settingsSection}>
                            <h3 className={styles.sectionTitle}>
                                <i className="bi bi-gear-fill"></i> Account Settings
                            </h3>
                            <span
                                className={`${styles.rolePill} ${styles[user.role.toLowerCase()]}`}
                            >
                                {user.role}
                            </span>




                            <div className="mt-4 p-3 bg-white rounded-3 border">
                                <p className="small text-muted mb-0">
                                    <strong>Role Access:</strong> As a <strong>{user.role}</strong>, you have access to the {user.role === 'ADMIN' ? 'Admin Suite' : user.role === 'EMPLOYER' ? 'Recruitment Dashboard' : 'Job Portal'}.
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
