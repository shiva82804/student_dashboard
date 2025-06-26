import React from "react";
import { Link } from "react-router-dom";
import { saveAs } from "file-saver";
import Papa from "papaparse";
const Navbar = () => {
  const handleDownload = () => {
    fetch("http://localhost:5000/api/students")
      .then((res) => res.json())
      .then((data) => {
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "student_scores.csv");
      });
  };
  const handleRefresh = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/recalculate");
      const data = await res.json();
      alert(data.message);
      window.location.reload();
    } catch (error) {
      alert("Failed to refresh data");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <Link className="navbar-brand fw-bold" to="/">
        🎓 Student Ranker
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/register">
              Register
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">
              Dashboard
            </Link>
          </li>
        </ul>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-light" onClick={handleDownload}>
            ⬇️ CSV
          </button>
          <button className="btn btn-outline-light" onClick={handleRefresh}>
            🔄 Refresh
          </button>
          <button className="btn btn-light text-danger" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
