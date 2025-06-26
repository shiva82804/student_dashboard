import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    leetcode: "",
    hackerrank: "",
    codeforces: "",
    codechef: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/register", form);
      alert("Registration successful!");
      setForm({
        name: "",
        email: "",
        password: "",
        gender: "",
        leetcode: "",
        hackerrank: "",
        codeforces: "",
        codechef: "",
      });
      window.location.href = "/login";
    } catch (err) {
      alert("Registration failed!");
      console.error(err);
    }
  };
  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Student Register Form</h3>
      <form className="border p-4 rounded shadow-sm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select
            name="gender"
            className="form-select"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">LeetCode Username</label>
          <input
            type="text"
            name="leetcode"
            className="form-control"
            value={form.leetcode}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">HackerRank Username</label>
          <input
            type="text"
            name="hackerrank"
            className="form-control"
            value={form.hackerrank}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Codeforces Handle</label>
          <input
            type="text"
            name="codeforces"
            className="form-control"
            value={form.codeforces}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">CodeChef Username</label>
          <input
            type="text"
            name="codechef"
            className="form-control"
            value={form.codechef}
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-success w-100" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
