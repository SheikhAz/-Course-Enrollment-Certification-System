import React, { useState, useEffect, useRef, useContext } from "react";
import Header from "../components/Header";
import Profile from "../components/Profile/Profile";
import axios from "axios";
import { Context } from "../Context/Context";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

const Home = () => {
  const { user } = useContext(Context);

  const [show, setShow] = useState(false);
  const [userModal, setUserModal] = useState(false);

  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courseToUpdate, setCourseToUpdate] = useState("");

  const selectRef = useRef();
  const updateRef = useRef();
  const resetRef = useRef();
  const modalBtnRef = useRef();

  /* ---------------- FETCH COURSES ---------------- */
  useEffect(() => {
    fetchAllCourses();
    fetchUserCourses();
  }, []);

  const fetchAllCourses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/register/getcourses"
      );
      setCourses(res.data); // <-- dataset stored in state
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

    if (!window.confirm("Do you want to select another course?")) {
      try {
        await axios.post("http://localhost:5000/api/register/course", {
          registration: user.registration,
          courses: updated,
        });
        toast.success("Course enrolled successfully");
        setSelectedCourses([]);
        fetchUserCourses();
      } catch {
        toast.error("You can enroll only once");
      }
    } else {
      resetRef.current.click();
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
    if (!window.confirm("Re-enroll all courses?")) return;

    try {
      await axios.delete("http://localhost:5000/api/register/deleteall", {
        data: { registration: user.registration },
      });
      toast.success("Courses removed");
      fetchUserCourses();
    } catch {
      toast.error("Failed to delete courses");
    }
  };

  /* ---------------- UPDATE COURSE ---------------- */
  const handleUpdateClick = (course) => {
    setCourseToUpdate(course);
    modalBtnRef.current.click();
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put("http://localhost:5000/api/register/update", {
        name: courseToUpdate,
        registration: user.registration,
        update: updateRef.current.value,
      });

      if (res.status === 200) {
        toast.success("Course updated successfully");
        fetchUserCourses();
        setShow(false);
      }
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="nav-side-container">
      <Header setUserModal={setUserModal} userModal={userModal} />

      <div className="dashboard-area">
        {userModal && <Profile />}

        {/* CENTER WRAPPER */}
        <div className="center-wrapper">
          {/* Enrollment Form */}
          <form className="enroll-card" onSubmit={handleSubmit}>
            <h2>Course Enrollment</h2>

            <label>Choose a course</label>
            <select ref={selectRef} required>
              <option value="" disabled hidden>
                Select course
              </option>
              {courses.map((c, i) => (
                <option key={i}>{c.courseName}</option>
              ))}
            </select>

            <div className="btn-group">
              <button type="reset" ref={resetRef} className="btn reject">
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

            {enrolledCourses.map((course, i) => (
              <div key={i} className="course-card">
                <span>{course}</span>
                <div>
                  <button
                    className="mini-btn delete"
                    onClick={() => handleDelete(course)}
                  >
                    Delete
                  </button>
                  <button
                    className="mini-btn update"
                    onClick={() => handleUpdateClick(course)}
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden Modal Trigger */}
      <Button
        ref={modalBtnRef}
        style={{ display: "none" }}
        onClick={() => setShow(true)}
      />

      {/* Update Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Course</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleUpdateSubmit}>
            <label>Update course with</label>
            <select ref={updateRef} required>
              <option value="" disabled hidden>
                Select course
              </option>
              {courses.map((c, i) => (
                <option key={i}>{c.courseName}</option>
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
