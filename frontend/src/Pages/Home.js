import React, { useState, useEffect, useRef, useContext } from "react";
import Header from "../components/Header";
import Profile from "../components/Profile/Profile";
import axios from "axios";
import { Context } from "../Context/Context";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

const Home = () => {
  const { user } = useContext(Context);

  const [show, setShow] = useState(false);
  const [userModal, setUserModal] = useState(false);

  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const selectRef = useRef();

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetchAllCourses();
    fetchUserCourses();
  }, []);

  const fetchAllCourses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/register/getcourses"
      );
      setCourses(res.data);
    } catch {
      toast.error("Failed to load courses");
    }
  };

  const fetchUserCourses = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/register/getsecscourses",
        { registration: user.registration }
      );
      setEnrolledCourses(res.data[0]?.courses || []);
    } catch {
      setEnrolledCourses([]);
    }
  };

  /* ---------------- ENROLL COURSE ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const selected = selectRef.current.value;
    if (!selected) return;

    const updated = [selected, ...selectedCourses];
    setSelectedCourses(updated);

    if (!window.confirm("Select another course?")) {
      try {
        await axios.post("http://localhost:5000/api/register/course", {
          registration: user.registration,
          courses: updated,
        });
        toast.success("Course enrolled successfully");
        fetchUserCourses();
        setSelectedCourses([]);
        setShow(false);
      } catch {
        toast.error("You can enroll only once");
      }
    }
  };

  /* ---------------- DELETE COURSE ---------------- */
  const handleDelete = async (course) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await axios.delete("http://localhost:5000/api/register/delete", {
        data: { name: course, registration: user.registration },
      });
      toast.success("Course deleted");
      fetchUserCourses();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ---------------- DELETE ALL ---------------- */
  const handleDropAll = async () => {
    if (!window.confirm("Delete all courses?")) return;

    try {
      await axios.delete("http://localhost:5000/api/register/deleteall", {
        data: { registration: user.registration },
      });
      toast.success("All courses removed");
      fetchUserCourses();
    } catch {
      toast.error("Failed to delete courses");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="nav-side-container">
      <Header setUserModal={setUserModal} userModal={userModal} />

      {userModal && <Profile />}

      {/* CENTERED BLACK BOX */}
      <div className="dashboard-wrapper">
        <div className="dashboard-box">
          <h2 className="dashboard-title">Dashboard</h2>

          <button className="enroll-btn" onClick={() => setShow(true)}>
            Enroll in Course
          </button>
        </div>
      </div>

      {/* ================= POPUP MODAL ================= */}
      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Course Enrollment</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form className="popup-form" onSubmit={handleSubmit}>
            <label>Choose a course</label>

            <select ref={selectRef} required>
              <option value="">Select course</option>
              {courses.map((c, i) => (
                <option key={i}>{c.courseName}</option>
              ))}
            </select>

            <div className="popup-btn-group">
              <button type="reset" className="btn-outline">
                Reject
              </button>
              <button type="submit" className="btn-primary">
                Accept
              </button>
            </div>
          </form>

          <hr />

          <div className="popup-enrolled">
            <div className="popup-header">
              <h5>Enrolled Courses</h5>
              <button className="btn-danger" onClick={handleDropAll}>
                Re-Enroll
              </button>
            </div>

            <div className="popup-course-list">
              {enrolledCourses.map((course, i) => (
                <div key={i} className="popup-course-item">
                  <span>{course}</span>
                  <button onClick={() => handleDelete(course)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;
