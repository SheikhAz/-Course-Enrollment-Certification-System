import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./Pages/Login/Login";
import Signup from "./Pages/SignUp/SignUp";
import Home from "./Pages/Home";
import CertificateView from "./Pages/CertificateView";

import AdminDashboard from "./Pages/admin/AdminDashboard";
import ManageCertificates from "./Pages/admin/ManageCertificates";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dash" element={<Home />} />

        {/* Student */}
        <Route
          path="/certificate/:enrollmentId"
          element={<CertificateView />}
        />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/certificates" element={<ManageCertificates />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
