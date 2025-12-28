const CertificateView = ({ certificate }) => {
  return (
    <div className="certificate-container">
      <h1>Certificate of Completion</h1>

      <p>This certifies that</p>
      <h2>{certificate.student.name}</h2>

      <p>has successfully completed</p>
      <h3>{certificate.course.title}</h3>

      <p>Issued on: {new Date(certificate.issueDate).toDateString()}</p>

      <p>Certificate ID: {certificate.certificateId}</p>
    </div>
  );
};

export default CertificateView;
