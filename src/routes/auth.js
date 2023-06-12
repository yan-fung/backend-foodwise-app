const express = require("express");
const authRouter = express.Router();
const User = require("../models/SignUpModels");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const isAuthenticated = require("../middlewares/jwt.middleware");

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

authRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "")
    return res.status(400).json({ err: "Please enter an email and password" });

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ err: "Invalid credentials" });
      } else {
        const passwordMatch = bcryptjs.compareSync(password, user.password);
        if (!passwordMatch) {
          return res.status(400).json({ err: "Invalid credentials" });
        }
        const payload = {
          name: user.name,
          email: user.email,
          id: user._id,
        };

        const token = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
          expiresIn: "7d",
        });
        console.log(token);
        res.status(200).json({ token });
      }
    })
    .catch((err) => {
      res.status(400).json({ err: "Something went wrong" });
    });
});

authRouter.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = authRouter;
