import { useParams } from "react-router-dom";
import "./CertificateView.css";

const CertificateView = () => {
  const { registration, courseName } = useParams();

  const downloadCertificate = () => {
    window.open(
      `${process.env.REACT_APP_API_URL}/certificates/download?registration=${registration}&courseName=${courseName}`,
      "_blank",
    );
  };

  return (
    <div className="certificate-page">
      <div className="certificate-card">
        <h1>Certificate of Completion</h1>

        <p className="certificate-text">
          You have successfully completed the course
        </p>

        <h2 className="course-name">{courseName}</h2>

        <button className="btn btn-primary" onClick={downloadCertificate}>
          Download Certificate
        </button>
      </div>
    </div>
  );
};

export default CertificateView;
