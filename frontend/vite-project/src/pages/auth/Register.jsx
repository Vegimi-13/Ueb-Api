import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../auth/useAuth";
import styles from "./Auth.module.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "CANDIDATE",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password Validation
    const password = form.password;
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter.");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Create account</h2>
          <p>Join FindJob and start your journey</p>
        </div>

        <form className={styles.body} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>First name</label>
            <input
              className={styles.input}
              name="firstName"
              required
              value={form.firstName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Last name</label>
            <input
              className={styles.input}
              name="lastName"
              required
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>

            <div className={styles.passwordWrapper}>
              <input
                className={styles.input}
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                required
                value={form.password}
                onChange={handleChange}
              />

              <span
                className={styles.eye}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </span>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>I am registering as</label>

            <div className={styles.roleSwitch}>
              <button
                type="button"
                className={`${styles.roleBtn} ${form.role === "CANDIDATE" ? styles.active : ""
                  }`}
                onClick={() => setForm({ ...form, role: "CANDIDATE" })}
              >
                <div className={styles.roleIcon}>👤</div>
                <div>
                  <div className={styles.roleTitle}>Candidate</div>
                  <div className={styles.roleDesc}>Find jobs & apply</div>
                </div>
              </button>

              <button
                type="button"
                className={`${styles.roleBtn} ${form.role === "EMPLOYER" ? styles.active : ""
                  }`}
                onClick={() => setForm({ ...form, role: "EMPLOYER" })}
              >
                <div className={styles.roleIcon}>🏢</div>
                <div>
                  <div className={styles.roleTitle}>Employer</div>
                  <div className={styles.roleDesc}>Post jobs & hire</div>
                </div>
              </button>
            </div>
          </div>

          <button className={styles.button} disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>

          <div className={styles.footer}>
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
