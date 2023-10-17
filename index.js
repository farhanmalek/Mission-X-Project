//Import usual packages
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken"); //Import JWT
//Setup Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//Project Library Route
app.use("/projectlibrary", require("./routes/projectlibrary"));
app.use("/login", require("./routes/login"));
app.use("/register", require("./routes/register"));

//create middleware that verifies the user.
const verifyUser = (req, res, next) => {
  //read cookie
  const token = req.cookies.token; // we named the cookie, token in the server
  if (!token) {
    return res.json({ Error: "Not authenticated" });
  } else {
    //verify token that we have generated
    jwt.verify(token, "mysecret", (err, decoded) => {
      if (err) return res.json({ Error: "Token not correct" });
      req.name = decoded.name;
      req.id = decoded.id;
      req.email = decoded.email;
      req.school = decoded.school;
      req.profile = decoded.profile;
      req.dob = decoded.dob;
      req.course = decoded.course;
      req.contact = decoded.contact;
      req.isTeacher = decoded.isTeacher;
      next();
    });
  }
};

//We need to verify the token to check if the user is logged in or not.
app.get("/", verifyUser, (req, res) => {
  return res
    .status(200)
    .json({
      name: req.name,
      id: req.id,
      email: req.email,
      school: req.school,
      profile: req.profile,
      dob: req.dob,
      course: req.course,
      contact:req.contact,
      isTeacher: req.isTeacher,
    });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.status(200).send("logged out");
});

//Setup port
const PORT = 5000;
app
  .listen(PORT, () => console.log(`Now Live @ http://localhost:${PORT}`))
  .on("error", (error) => console.log(error));
