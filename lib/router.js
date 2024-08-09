const express = require("express");
const User = require("../models/user");

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

    user.save();
    console.log(this.user);

    // // console.log(firstName, lastName, email, password);
    // // res.status(200).json(user);

    res
      .status(200)
      .json({ time: Date.now(), msg: "succesfully registered", user });
  } catch (error) {
    res.json(error);
  }
});

_.post("/login", async (req, res) => {
  try {
    res.status(200).json({ time: Date.now(), msg: "succesfully login" });
  } catch (error) {}
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
