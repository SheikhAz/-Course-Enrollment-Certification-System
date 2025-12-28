
import "./App.css";
import Home from "./Pages/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../src/Pages/Login/Login";
import Signup from "../src/Pages/SignUp/SignUp";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dash" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
