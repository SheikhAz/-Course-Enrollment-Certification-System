import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => console.error("Failed to load stats"));
  }, []);

  if (!stats) return <p className="loading">Loading...</p>;

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-content">
        <h1>Admin Dashboard</h1>

        <div className="stats-card">
          <p>
            <strong>Total Enrollments:</strong> {stats.totalEnrollments}
          </p>
          <p>
            <strong>Completed Courses:</strong> {stats.completedCourses}
          </p>
          <p>
            <strong>Completion Rate:</strong> {stats.completionRate}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
