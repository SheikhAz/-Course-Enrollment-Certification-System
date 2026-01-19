import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ManageCertificates.css";

const ManageCertificates = () => {
  const [enrollments, setEnrollments] = useState([]);

  /* FETCH ALL ENROLLMENTS */
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

  /* ISSUE CERTIFICATE*/
  const issueCertificate = async (enrollmentId, courseName) => {
    try {
      await axios.put("http://localhost:5000/api/admin/issue-certificate", {
        enrollmentId,
        courseName,
      });

      toast.success("Certificate issued successfully");
      fetchEnrollments();
    } catch (err) {
      toast.error("Certificate issue failed");
    }
  };

  return (
    <div className="manage-certificates">
      <div className="manage-certificates-content">
        <h1>Manage Certificates</h1>

        {enrollments.length === 0 ? (
          <p>No enrollments found</p>
        ) : (
          enrollments.map((enrollment) =>
            enrollment.courses.map((course, index) => (
              <div
                className="certificate-card"
                key={`${enrollment._id}-${index}`}
              >
                <p>
                  <strong>Registration:</strong> {enrollment.registration}
                </p>

                <p>
                  <strong>Course:</strong> {course.courseName}
                </p>

                <p>
                  <strong>Status:</strong> {course.status || "enrolled"}
                </p>

                <p>
                  <strong>Certificate:</strong>{" "}
                  {course.certificateIssued ? "Issued" : "Not Issued"}
                </p>

                <button
                  disabled={
                    course.certificateIssued || course.status !== "completed"
                  }
                  onClick={() =>
                    issueCertificate(enrollment._id, course.courseName)
                  }
                  className={`issue-btn ${
                    course.certificateIssued || course.status !== "completed"
                      ? "disabled"
                      : ""
                  }`}
                >
                  Issue Certificate
                </button>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default ManageCertificates;
