import React, { useContext } from "react";
import {
  FaGraduationCap,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";
import "./Header.css";
import { Context } from "../Context/Context";


const Header = ({ userModal, setUserModal }) => {
  const { user } = useContext(Context);

  //ROLE CHECK
  const isAdmin = user?.userType === "admin";

  return (
    <header className="app-header">
      {/* LEFT */}
      <div className="header-left">
        <div className="app-icon">
          <FaGraduationCap size={20} />
        </div>

        {/* DYNAMIC TITLE */}
        <span className="app-title">
          {isAdmin ? "Admin Dashboard" : "Student Dashboard"}
        </span>
      </div>

      {/* RIGHT */}
      <div className="header-right">
        <button className="icon-btn">
          <FaBell size={22} />
        </button>

        <button
          className="icon-btn profile-btn"
          onClick={() => setUserModal(!userModal)}
        >
          <FaUserCircle size={24} />
        </button>

        {/* PROFILE MENU */}
        {userModal && (
          <div className="profile-menu">
            <div className="profile-name">{user?.name}</div>

            <a href="/settings">Settings</a>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
