const express = require("express");
const authRouter = express.Router();
const User = require("../models/SignUpModels");
const bcryptjs = require("bcryptjs");

authRouter.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  if (username === "" || email === "" || password === "") {
    return res
      .status(400)
      .json({ err: "Please enter a name, email and password." });
  }
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ err: "Please enter a valid email" });
  }
  const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      err: "Password must be at least 8 characters long and have at least one uppercase and on lowercase letter.",
    });
  }

  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({ err: "User already exists" });
    } else {
      const salt = bcryptjs.genSaltSync(10);
      const hashedPassword = bcryptjs.hashSync(password, salt);

      return User.create({
        username: username,
        email: email,
        password: hashedPassword,
      })
        .then(() => {
          return res.status(200).json({ message: "User has been created" });
        })
        .catch(() => {
          return res.status(400).json({ err: "User could not be created" });
        });
    }
  });
});

authRouter.post("/login", (req, res) => {});

authRouter.get("/verify", (req, res) => {});

module.exports = authRouter;
