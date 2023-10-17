const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // Import JWT
const db = require("../database");
//handle if student
function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  let query = "SELECT * FROM student WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, result) => {
    if (err) {
      return res.status(500).send("failed to get users");
    }

  

    if (result.length > 0) {
      const name = result[0].name;
      const id = result[0].student_id;
      const email = result[0].email;
      const school = result[0].school;
      const profile = result[0].profile_pic;
      const dob = result[0].date_of_birth;
      const course = result[0].course;
      const contact = result[0].contact_number
      const isTeacher = result[0].isTeacher;

      const token = jwt.sign(
        { name, id, email, school, profile, dob, course, contact, isTeacher },
        "mysecret",
        { expiresIn: "1d" }
      );

      res.cookie("token", token);

      return res.status(200).send("Login successful");
    } else {
      return res.status(404).send("Invalid credentials");
    }
  });
}

router.post("/student", loginUser);

//handle if teacher
function loginTeacher(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  let query = "SELECT * FROM teacher WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, result) => {
    if (err) {
      return res.status(500).send("failed to get users");
    }

  

    if (result.length > 0) {
      const name = result[0].name;
      const id = result[0].student_id;
      const email = result[0].email;
      const school = result[0].school;
      const profile = result[0].profile_pic;
      const dob = result[0].date_of_birth;
      const contact = result[0].contact_number
      const isTeacher = result[0].isTeacher;

      const token = jwt.sign(
        { name, id, email, school, profile, dob, contact, isTeacher },
        "mysecret",
        { expiresIn: "1d" }
      );

      res.cookie("token", token);

      return res.status(200).send("Login successful");
    } else {
      return res.status(404).send("Invalid credentials");
    }
  });
}

router.post("/teacher", loginTeacher);





module.exports = router;
