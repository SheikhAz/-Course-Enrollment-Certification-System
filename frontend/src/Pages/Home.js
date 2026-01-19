import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import axios from "axios";
import { Context } from "../Context/Context";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

const Home = () => {
  const { user } = useContext(Context);

  console.log("Logged in role:", user?.role);

  const [show, setShow] = useState(false);
  const [userModal, setUserModal] = useState(false);

  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courseToUpdate, setCourseToUpdate] = useState(null);

  /* ================= STUDENT DATA ================= */
  useEffect(() => {
    if (user?.role === "user") {
      fetchAllCourses();
      fetchUserCourses();
    }
  }, [user]);

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
      setEnrolledCourses(res.data?.courses || []);
    } catch {
      setEnrolledCourses([]);
    }
  };

  /* ================= STUDENT ACTIONS ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/register/course",
        {
          registration: user.registration,
          course: selectedCourse,
        }
      );

      toast.success("Course enrolled successfully");
      setSelectedCourse("");
      setEnrolledCourses(res.data.courses);
    } catch {
      toast.error("Enrollment failed");
    }
  };

  const handleDelete = async (courseName) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await axios.delete("http://localhost:5000/api/register/delete", {
        data: { name: courseName, registration: user.registration },
      });

      toast.success("Course deleted");
      fetchUserCourses();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleDropAll = async () => {
    if (!window.confirm("Re-enroll all courses?")) return;

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

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put("http://localhost:5000/api/register/update", {
        name: courseToUpdate.courseName,
        registration: user.registration,
        update: selectedCourse,
      });

      toast.success("Course updated");
      setShow(false);
      fetchUserCourses();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="nav-side-container">
      <Header setUserModal={setUserModal} userModal={userModal} />
      <div className="dashboard-area">
        {/* ================= ADMIN DASHBOARD ================= */}
        {user?.role === "admin" && (
          <div className="admin-dashboard">
            <div className="admin-cards">
              <Link to="/admin/dashboard" className="admin-card-lg">
                <h2>Dashboard</h2>
                <p>View system statistics and reports</p>
              </Link>

              <Link to="/admin/manage-certificates" className="admin-card-lg">
                <h2>Issue Certificates</h2>
                <p>Approve & issue certificates to students</p>
              </Link>

              <Link to="/admin/certificates" className="admin-card-lg">
                <h2>View Certificates</h2>
                <p>View all issued certificates</p>
              </Link>
            </div>
          </div>
        )}

        {/* ================= STUDENT DASHBOARD ================= */}
        {user?.role === "user" && (
          <div className="student-grid">
            <form className="enroll-card" onSubmit={handleSubmit}>
              <h2>Course Enrollment</h2>

              <label>Choose a course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select course
                </option>
                {courses.map((c, i) => (
                  <option key={i} value={c.courseName}>
                    {c.courseName}
                  </option>
                ))}
              </select>

              <div className="btn-group">
                <button
                  type="button"
                  className="btn reject"
                  onClick={() => setSelectedCourse("")}
                >
                  Reject
                </button>
                <button type="submit" className="btn accept">
                  Accept
                </button>
              </div>
            </form>

            <div className="enrolled-section">
              <div className="enrolled-header">
                <h3>Enrolled Courses</h3>
                <button className="btn reenroll" onClick={handleDropAll}>
                  Re-Enroll
                </button>
              </div>

              {enrolledCourses.length === 0 ? (
                <p>No courses enrolled yet</p>
              ) : (
                enrolledCourses.map((course) => (
                  <div key={course._id} className="course-card">
                    <strong>{course.courseName}</strong>
                    <div className="course-actions">
                      <button
                        className="mini-btn delete"
                        onClick={() => handleDelete(course.courseName)}
                      >
                        Delete
                      </button>
                      <button
                        className="mini-btn update"
                        onClick={() => {
                          setCourseToUpdate(course);
                          setShow(true);
                        }}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdateSubmit}>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
            >
              <option value="" disabled>
                Select course
              </option>
              {courses.map((c, i) => (
                <option key={i} value={c.courseName}>
                  {c.courseName}
                </option>
              ))}
            </select>

            <Button type="submit" className="mt-3" variant="success">
              Update
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;
