const express = require("express");
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

    console.log(user);

    res
      .status(200)
      .json({ time: Date.now(), msg: "succesfully registered", user });
  } catch (error) {
    res.json(error);
  }
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
