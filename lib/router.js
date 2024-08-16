const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const passport = require("passport");

const db = require("./db");

let _ = express.Router();

_.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    let user = new User();

    let msg = false;

    msg = user.setFirstName(firstName);

    if (msg)
      return res.status(400).json({
        error: {
          code: 400,
          type: "first Name",
          message: msg,
        },
      });

    msg = user.setLastName(lastName);

    if (msg)
      return res.status(400).json({
        error: {
          code: 400,
          type: "last Name",
          message: msg,
        },
      });

    msg = user.setEmail(email);

    if (msg)
      return res.status(400).json({
        error: {
          code: 400,
          type: "email Name",
          message: msg,
        },
      });

    msg = await user.setPassword(password);

    if (msg)
      return res.status(400).json({
        error: {
          code: 400,
          type: "password problem",
          message: msg,
        },
      });

    user.save(user);

    // console.log(user);

    const JWT_SECRET = "abcdefghijklm";

    const payload = { email };

    // const token = "xyz"; //encrypted email with jwt
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      time: Date.now(),
      msg: "succesfully registered",
      user,
      verificationToken: token,
    });
  } catch (error) {
    res.json(error);
  }
});

_.post("/email-verification", (req, res) => {
  const verificationToken = req.body.verificationToken;

  if (!token) {
    return res.status(400).send("should have a token");
  }

  //verify jwt verification if invalid jwt return error invalid token

  const decoded = jwt.verify(verificationToken, JWT_SECRET);

  if (!decoded) {
    return res.status(401).json({ error: "Invalid token " });
  }

  // extract email form jwt
  const { email } = decoded;

  //find user by email
  const foundUser = db.findByEmail(email);

  //if user=null return error
  if (!foundUser)
    return res.status(404).json({ msg: "could not found the user" });

  db.setVerified(email);

  //user.isEmailVerify=true

  //user.save();
});

_.post("/setpassword", (req, res) => {
  const verificationToken = req.body.verificationToken;
  const { newPassWord } = req.body;

  if (!token) {
    return res.status(400).send("should have a token");
  }

  const decoded = jwt.verify(verificationToken, JWT_SECRET);

  if (!decoded) {
    return res.status(401).json({ error: "Invalid token " });
  }

  // extract email form jwt
  const { email } = decoded;

  if (db.findByEmail(email)) {
    db.upDatePassword(email, newPassWord);
  }
});

_.post("reset-password", (req, res) => {
  const { email, password } = req.body;
  db.upDatePassword(email, password);
});

_.post("/login", (req, res, next) => {
  console.log(`1- Login handler ${JSON.stringify(req.body)}`);

  passport.authenticate("local", (err, user) => {
    console.log(`3-  passport authenticate ${JSON.stringify(user)}`);

    if (err) {
      res.status(401).json({
        timeStemp: Date.now(),
        msg: "Access denied. User Name and password is incorrect.",
        code: 401,
      });
    }

    if (!user) {
      res.status(401).json({
        timeStemp: Date.now(),
        msg: "Unauthorized User",
        code: 401,
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      res.status(200).json({ redirectTo: "/profile" });
    });
  })(req, res, next);
});

const requirAuth = (req, res, next) => {
  console.log("require middle Ware authentication");
  if (req.isAuthenticated()) next();
  else
    res
      .status(403)
      .json({ timeStemp: Date.now(), msg: "Accessed iDenied", code: 403 });
};

_.get("/user", requirAuth, async (req, res) => {
  try {
    const user = db.findOne(req.user?.id);

    if (!user)
      return res
        .status(403)
        .json({ timeStemp: Date.now(), msg: "Accessed Denied", code: 403 });

    res.status(200).json({ ...user });
  } catch (err) {
    console.error(new Error(err.message));
    res.status(500).json({
      timestamp: Date.now(),
      msg: "Failed to get user, internal server error",
      code: 500,
    });
  }
});

_.post("/logout", async (req, res) => {
  try {
    res.status(200).json({ time: Date.now(), msg: "succesfully logout" });
  } catch (error) {}
});

_.post("*", async (req, res) => {
  try {
    res
      .status(200)
      .json({ time: Date.now(), msg: "there exist not such route" });
  } catch (error) {}
});

module.exports = _;
