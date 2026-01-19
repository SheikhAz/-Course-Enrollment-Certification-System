import React, { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../../Context/Context";



const Login = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passRef = useRef();
  const { dispatch } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch({ type: "LOGIN_START" });

    const loginCred = {
      email: emailRef.current.value,
      password: passRef.current.value,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/register/auth",
        loginCred,
      );

      // 🔑 MAP userType → role
      const loggedUser = {
        ...res.data.student,
        role: res.data.student.userType,
      };

      toast.success("Logged in successfully");

      dispatch({ type: "LOGIN_SUCCESS", payload: loggedUser });
      localStorage.setItem("user", JSON.stringify(loggedUser));

      // ✅ ADD THIS LINE (VERY IMPORTANT)
      localStorage.setItem("token", res.data.token);

      navigate("/dash");

    } catch (error) {
      toast.dismiss();
      toast.error("Credentials are incorrect");
      dispatch({ type: "LOGIN_FAILURE" });
    }
  };

  return (
    <div className="login-container">
      <div className="login-section">
        <h2>LOGIN</h2>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Email" ref={emailRef} required />
          <input
            type="password"
            placeholder="Password"
            ref={passRef}
            required
          />

          <div className="forget-pass">
            <a href="#">Forget Your Password?</a>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <div className="sign-link">
            <h3>Don't have any account?</h3>
            <span>
              <Link to="/signup">Signup Now</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
