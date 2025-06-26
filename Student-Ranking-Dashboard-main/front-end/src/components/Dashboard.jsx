import React, { useEffect, useState } from "react";
import axios from "axios";
const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first.");
      window.location.href = "/login";
      return;
    }
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedStudents = response.data.sort((a, b) => b.score - a.score);
        setStudents(sortedStudents);
      } catch (err) {
        console.error("Error fetching students:", err);
        alert("Session expired. Please login again.");
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (students.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h4>No students found. Please register students first.</h4>
      </div>
    );
  }
  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Top Student Rankings</h3>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Score</th>
            <th>LeetCode</th>
            <th>HackerRank</th>
            <th>Codeforces</th>
            <th>CodeChef</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student._id}>
              <td>{index + 1}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.score}</td>
              <td>{student.leetcode}</td>
              <td>{student.hackerrank}</td>
              <td>{student.codeforces}</td>
              <td>{student.codechef}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
