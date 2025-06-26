const express = require("express");
const {
  registerStudent,
  getRankedStudents,
  loginStudent,
  downloadCSV,
} = require("../controllers/studentController");
const protect = require("../middlewares/authMiddleware");
const { calcScore } = require("../utils/fetchScores");
const Student = require("../models/Student");
const router = express.Router();

router.post("/register", registerStudent);
router.get("/students", getRankedStudents);
router.post("/login", loginStudent);
router.get("/download", protect, downloadCSV);
router.get("/recalculate", async (req, res) => {
  try {
    const students = await Student.find();
    for (let student of students) {
      try {
        const score = await calcScore(student);
        student.score = score;
        student.lastUpdated = new Date();
        student.fetchError = null;
        await student.save();
      } catch (err) {
        student.fetchError = err.message;
        await student.save();
      }
    }
    res.status(200).json({ message: "Scores recalculated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
