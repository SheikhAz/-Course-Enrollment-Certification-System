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
      <div className="admin-cards">
        <div className="admin-card-lg">
          <h2>Total Enrollments</h2>
          <p>{stats.totalEnrollments}</p>
        </div>

        <div className="admin-card-lg">
          <h2>Completed Courses</h2>
          <p>{stats.completedCourses}</p>
        </div>

        <div className="admin-card-lg">
          <h2>Completion Rate</h2>
          <p>{stats.completionRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
