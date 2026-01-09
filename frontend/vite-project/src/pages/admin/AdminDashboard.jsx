import { useState, useEffect } from "react";
import api, { jobApi, appApi } from "../../config/api";
import styles from "./AdminDashboard.module.css";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalCompanies: 0,
    totalApplications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersRes = await api.get("/auth/admin/users");
      const totalUsers = usersRes.data.length;

      // Fetch jobs
      const jobsRes = await jobApi.get("/jobs");
      const totalJobs = jobsRes.data.length;

      // Fetch companies
      const companiesRes = await jobApi.get("/companies");
      const totalCompanies = companiesRes.data.length;

      // Fetch applications
      const applicationsRes = await appApi.get("/applications");
      const totalApplications = applicationsRes.data.length;

      setMetrics({
        totalUsers,
        totalJobs,
        totalCompanies,
        totalApplications,
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
        <p className={styles.dashboardSubtitle}>Overview of your system metrics</p>
      </div>

      <div className={styles.metricsGrid}>
        {/* Total Users Card */}
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>👥</div>
          <div className={styles.metricContent}>
            <p className={styles.metricLabel}>Total Users</p>
            <p className={styles.metricValue}>
              {loading ? "-" : metrics.totalUsers}
            </p>
          </div>
        </div>

        {/* Total Jobs Card */}
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>💼</div>
          <div className={styles.metricContent}>
            <p className={styles.metricLabel}>Total Jobs</p>
            <p className={styles.metricValue}>
              {loading ? "-" : metrics.totalJobs}
            </p>
          </div>
        </div>

        {/* Total Companies Card */}
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>🏢</div>
          <div className={styles.metricContent}>
            <p className={styles.metricLabel}>Total Companies</p>
            <p className={styles.metricValue}>
              {loading ? "-" : metrics.totalCompanies}
            </p>
          </div>
        </div>

        {/* Total Applications Card */}
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>📝</div>
          <div className={styles.metricContent}>
            <p className={styles.metricLabel}>Total Applications</p>
            <p className={styles.metricValue}>
              {loading ? "-" : metrics.totalApplications}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
