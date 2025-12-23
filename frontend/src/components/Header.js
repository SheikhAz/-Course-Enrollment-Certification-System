import React from "react";
import { FaGraduationCap, FaBell, FaUserCircle } from "react-icons/fa";
import "./Header.css";

const Header = ({ userModal, setUserModal }) => {
  return (
    <header className="app-header">
      {/* LEFT */}
      <div className="header-left">
        <div className="app-icon">
          <FaGraduationCap size={20} /> {/* 👈 increased */}
        </div>
        <span className="app-title">Student Dashboard</span>
      </div>

      {/* RIGHT */}
      <div className="header-right">
        <button className="icon-btn">
          <FaBell size={22} /> {/* 👈 increased */}
        </button>

        <button
          className="icon-btn profile-btn"
          onClick={() => setUserModal(!userModal)}
        >
          <FaUserCircle size={24} /> {/* 👈 slightly bigger */}
        </button>
      </div>
    </header>
  );
};

export default Header;
