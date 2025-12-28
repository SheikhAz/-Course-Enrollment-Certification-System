import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageCertificates = () => {
  const [enrollments, setEnrollments] = useState([]);

  /* ---------------- FETCH ALL ENROLLMENTS ---------------- */
  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/enrollments"
      );
      setEnrollments(res.data);
    } catch {
      toast.error("Failed to load enrollments");
    }
  };

  /* ---------------- ISSUE CERTIFICATE ---------------- */
  const issueCertificate = async (enrollmentId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/admin/issue-certificate/${enrollmentId}`
      );

      toast.success("Certificate issued successfully");
      fetchEnrollments(); // refresh list
    } catch (err) {
      toast.error(err.response?.data || "Certificate issue failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Certificates</h2>

      {enrollments.length === 0 ? (
        <p>No enrollments found</p>
      ) : (
        enrollments.map((enrollment) => (
          <div
            key={enrollment._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
            <p>
              <strong>Student:</strong> {enrollment.student?.name}
            </p>
            <p>
              <strong>Course:</strong> {enrollment.course?.title}
            </p>
            <p>
              <strong>Status:</strong> {enrollment.status}
            </p>
            <p>
              <strong>Certificate:</strong>{" "}
              {enrollment.certificateIssued ? "Issued" : "Not Issued"}
            </p>

            {/* ✅ ISSUE CERTIFICATE BUTTON */}
            <button
              disabled={
                enrollment.certificateIssued ||
                enrollment.status !== "completed"
              }
              onClick={() => issueCertificate(enrollment._id)}
              style={{
                padding: "8px 14px",
                background:
                  enrollment.certificateIssued ||
                  enrollment.status !== "completed"
                    ? "#ccc"
                    : "#198754",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor:
                  enrollment.certificateIssued ||
                  enrollment.status !== "completed"
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              Issue Certificate
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageCertificates;
