import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Profile from "../components/Profile/Profile";
import axios from "axios";
import { Context } from "../Context/Context";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

const Home = () => {
  const { user } = useContext(Context);

  const [show, setShow] = useState(false);
  const [userModal, setUserModal] = useState(false);

  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courseToUpdate, setCourseToUpdate] = useState(null);

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
      console.log("COURSES FROM API:", res.data);
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

      // EXPECTED FORMAT:
      // [{ _id, courseName, status, certificateIssued }]
      setEnrolledCourses(res.data?.courses || []);
    } catch {
      setEnrolledCourses([]);
    }
  };

  /* ---------------- ENROLL COURSE ---------------- */
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
    } catch (err) {
      toast.error("Enrollment failed");
    }
  };

  /* ---------------- DELETE COURSE ---------------- */
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

  /* ---------------- DELETE ALL ---------------- */
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

  /* ---------------- UPDATE COURSE ---------------- */
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

  /* ---------------- UI ---------------- */
  return (
    <div className="nav-side-container">
      <Header setUserModal={setUserModal} userModal={userModal} />

      <div className="dashboard-area">
        {userModal && <Profile />}

        <div className="center-wrapper">
          {/* Enrollment Card */}
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

          {/* Enrolled Courses */}
          <div className="enrolled-section">
            <div className="enrolled-header">
              <h3>Enrolled Courses</h3>
              <button className="btn reenroll" onClick={handleDropAll}>
                Re-Enroll
              </button>
            </div>

            {enrolledCourses.length === 0 ? (
              <p style={{ color: "#64748b" }}>No courses enrolled yet</p>
            ) : (
              enrolledCourses.map((course) => (
                <div key={course._id} className="course-card">
                  <div>
                    <strong>{course.courseName}</strong>
                    <p>Status: {course.status || "enrolled"}</p>
                  </div>

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

                    {/* ✅ VIEW CERTIFICATE */}
                    {course.certificateIssued && (
                      <Link
                        className="mini-btn certificate"
                        to={`/certificate/${course._id}`}
                      >
                        View Certificate
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Update Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Course</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleUpdateSubmit}>
            <label>Select new course</label>
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
