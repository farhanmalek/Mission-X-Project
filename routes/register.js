const express = require("express");
const router = express.Router();
const db = require("../database");
//Student Register
function registerUser(req, res) {
  const selectQuery = "SELECT * FROM student WHERE email = ?";
  const email = req.body.email;
  //First check if user already exists
  db.query(selectQuery, email, (err, result) => {
    if (err) {
      return res.status(500).send("Error connecting to database");
    }

    if (result.length > 0) {
      return res.status(409).send("This email is already registered");
    }

    // User is new so insert into DB
    const insertQuery = "INSERT INTO student (name, email, password, isTeacher) VALUES (?, ?, ?, ?)";
    const values = [
      req.body.fullName,
      email,
      req.body.password,
      req.body.isTeacher 
    ];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.log(err, "error inserting user");
        return res.status(500).send("Error inserting user");
      } else {
        return res.status(200).send("User Successfully Added");
      }
    });
  });
}

router.post("/student", registerUser);
//Teacher Register
function registerTeacher(req, res) {
  const selectQuery = "SELECT * FROM teacher WHERE email = ?";
  const email = req.body.email;
  //First check if user already exists
  db.query(selectQuery, email, (err, result) => {
    if (err) {
      return res.status(500).send("Error connecting to database");
    }

    if (result.length > 0) {
      return res.status(409).send("This email is already registered");
    }

    // User is new so insert into DB
    const insertQuery = "INSERT INTO teacher (name, email, password, isTeacher) VALUES (?, ?, ?, ?)";
    const values = [
      req.body.fullName,
      email,
      req.body.password,
      req.body.isTeacher 
    ];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.log(err, "error inserting user");
        return res.status(500).send("Error inserting user");
      } else {
        return res.status(200).send("User Successfully Added");
      }
    });
  });
}

router.post("/teacher", registerTeacher);


module.exports = router;
