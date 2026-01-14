import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import axios from "axios";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const regRef = useRef();
  const passRef = useRef();
  const addRef = useRef();
  const adminKeyRef = useRef();

  const [role, setRole] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      password: passRef.current.value,
      address: role === "admin" ? "ADMIN" : addRef.current.value,
      registration: role === "admin" ? null : regRef.current.value,
      role,
      adminKey: role === "admin" ? adminKeyRef.current.value : null,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/register/add",
        data
      );
      if (res.status === 201) {
        toast.success("Student has Been Added Successfully");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error("Some error occurred please try again");
      }
    } catch (error) {
      console.log(error.response?.data);
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "Signup failed. Please try again."
      );
    }

  };


  return (
    <div className="sign-container">
      <div className="signup-section">
        <div className="sign-section">
          <h2>Signup</h2>
        </div>
        {/* Role Selection */}
        <div className="role-section">
          <label>
            <input
              type="radio"
              name="role"
              value="user"
              checked={role === "user"}
              onChange={() => setRole("user")}
            />
            User
          </label>

          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === "admin"}
              onChange={() => setRole("admin")}
            />
            Admin
          </label>
        </div>

        {/* Admin Secret Key */}
        {role === "admin" && (
          <input
            type="password"
            placeholder="Admin Secret Key"
            ref={adminKeyRef}
            required
          />
        )}

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" ref={nameRef} required />
          <input type="email" placeholder="Email" ref={emailRef} required />
          <input
            type="text"
            placeholder="Phone Number"
            ref={phoneRef}
            required
          />
          {role === "user" && (
            <input
              type="text"
              placeholder="Registration number"
              ref={regRef}
              required
            />
          )}
          {role === "user" && (
            <input
              placeholder="Enter Your Address"
              ref={addRef}
              required
            ></input>
          )}
          <input
            type="password"
            placeholder="Password"
            ref={passRef}
            required
          />
          <div className="sign-sec">
            <input type="submit" value="SIGNUP" />
          </div>
          <div className="sign-link">
            <h3>
              If you already have an account? <Link to="/">Login</Link>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
