import { useEffect, useState } from "react";
import axios from "axios";
import "./ViewCertificates.css";

const ViewCertificates = () => {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/certificates")
      .then((res) => setCertificates(res.data));
  }, []);

  return (
    <div className="admin-page">
      <h1>Issued Certificates</h1>

      {certificates.length === 0 ? (
        <p>No certificates issued yet</p>
      ) : (
        <table className="cert-table">
          <thead>
            <tr>
              <th>Registration</th>
              <th>Course</th>
              <th>Issued Date</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((c, i) => (
              <tr key={i}>
                <td>{c.registration}</td>
                <td>{c.courseName}</td>
                <td>{new Date(c.issuedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewCertificates;
    