import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CertificateView.css";

const CertificateView = () => {
  const { enrollmentId } = useParams();

  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await axios.get(`/api/certificates/view/${enrollmentId}`);
        setCertificate(res.data);
      } catch (err) {
        setError(err.response?.data || "Certificate not available");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [enrollmentId]);

  if (loading) return <p>Loading certificate...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="certificate-page">
      <div className="certificate-card">
        <h1>Certificate of Completion</h1>

        <p className="certificate-text">This is to certify that</p>

        <h2 className="student-name">{certificate.student.name}</h2>

        <p className="certificate-text">
          has successfully completed the course
        </p>

        <h3 className="course-name">{certificate.course.title}</h3>

        <p className="certificate-text">
          on {new Date(certificate.issueDate).toDateString()}
        </p>

        <div className="certificate-footer">
          <p>
            Certificate ID: <strong>{certificate.certificateId}</strong>
          </p>
          <p>Issued By: {certificate.issuedBy}</p>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
