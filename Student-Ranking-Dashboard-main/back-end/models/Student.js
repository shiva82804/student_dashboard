const { Schema, model } = require("mongoose");

const studentSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  gender: String,
  leetcode: String,
  hackerrank: String,
  codeforces: String,
  codechef: String,
  score: { type: Number, default: 0 },
});

const Student = model("Student", studentSchema);
module.exports = Student;
