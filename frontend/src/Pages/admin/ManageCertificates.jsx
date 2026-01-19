import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ManageCertificates.css";

const ManageCertificates = () => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/enrollments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setEnrollments(res.data);
    } catch {
      toast.error("Failed to load enrollments");
    }
  };




  const handleUploadCertificate = async (file, registration, courseName) => {
    try {
      const formData = new FormData();
      formData.append("certificate", file);
      formData.append("registration", registration);
      formData.append("courseName", courseName);

      await axios.post(
        "http://localhost:5000/api/admin/certificates/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

     toast.success("Certificate uploaded successfully");
     fetchEnrollments();
    } catch (error) {
      alert(error.response?.data?.message || "Upload failed");
    }
  };


  return (
    <div className="manage-certificates">
      <h1 className="page-title">Manage Certificates</h1>

      {enrollments.length === 0 ? (
        <p className="no-data">No enrollments found</p>
      ) : (
        enrollments.map((enrollment) =>
          enrollment.courses.map((course, index) => (
            <div
              className="certificate-card"
              key={`${enrollment._id}-${index}`}
            >
              {/* LEFT SIDE */}
              <div className="card-left">
                <div className="info">
                  <span>Registration</span>
                  <strong>{enrollment.registration}</strong>
                </div>

                <div className="info">
                  <span>Course</span>
                  <strong>{course.courseName}</strong>
                </div>

                <div className="info">
                  <span>Status</span>
                  <strong>{course.status || "enrolled"}</strong>
                </div>

                <div className="info">
                  <span>Certificate</span>
                  <strong>
                    {course.certificateIssued ? "Issued" : "Not Issued"}
                  </strong>
                </div>

                <label
                  className={`issue-btn ${
                    course.certificateIssued || course.status !== "completed"
                      ? "disabled"
                      : ""
                  }`}
                >
                  Upload Certificate
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    hidden
                    disabled={
                      course.certificateIssued || course.status !== "completed"
                    }
                    onChange={(e) =>
                      handleUploadCertificate(
                        e.target.files[0],
                        enrollment.registration,
                        course.courseName,
                      )
                    }
                  />
                </label>
              </div>

              {/* RIGHT SIDE */}
              <div className="card-right">
                <img src="/certificate.png" alt="Certificate Illustration" />
              </div>
            </div>
          )),
        )
      )}
    </div>
  );
};

export default ManageCertificates;
