const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const parser = require("json2csv");
const jwt = require("jsonwebtoken");
const { calcScore } = require("../utils/fetchScores");

async function registerStudent(req, res) {
  try {
    const {
      name,
      email,
      password,
      gender,
      leetcode,
      hackerrank,
      codeforces,
      codechef,
    } = req.body;
    if (await Student.findOne({ email })) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const score = await calcScore({
      leetcode,
      hackerrank,
      codeforces,
      codechef,
    });
    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      gender,
      leetcode,
      hackerrank,
      codeforces,
      codechef,
      score,
    });
    res.status(201).json({ message: "Student registered" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
}

async function loginStudent(req, res) {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    console.log("Student found:", student);
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (!(await bcrypt.compare(password, student.password))) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, student });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

async function getRankedStudents(req, res) {
  try {
    const studensts = await Student.find().sort({ score: -1 });
    res.json(studensts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch students" });
  }
}

async function downloadCSV(req, res) {
  try {
    const students = await Student.find().sort({ score: -1 });

    const fields = [
      "name",
      "email",
      "gender",
      "leetcode",
      "hackerrank",
      "codeforces",
      "codechef",
      "score",
    ];
    const parser = new Parser({ fields });
    const csv = parser.parse(students);

    res.header("Content-Type", "text/csv");
    res.attachment("students.csv");
    return res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating CSV");
  }
}

module.exports = {
  registerStudent,
  getRankedStudents,
  loginStudent,
  downloadCSV,
};
