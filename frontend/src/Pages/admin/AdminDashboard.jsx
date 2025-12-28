import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("/api/admin/stats").then((res) => {
      setStats(res.data);
    });
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Total Enrollments: {stats.totalEnrollments}</p>
      <p>Completed Courses: {stats.completedCourses}</p>
      <p>Completion Rate: {stats.completionRate}%</p>
    </div>
  );
};

export default AdminDashboard;
