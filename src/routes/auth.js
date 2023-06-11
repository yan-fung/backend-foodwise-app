const express = require("express");
const authRouter = express.Router();
const signUpSchema = require("../models/SignUpModels");

authRouter.post("/signup", (request, response) => {
  const signedUpUser = new signUpSchema({
    fullName: request.body.fullName,
    username: request.body.usernmae,
    email: request.body.email,
    password: request.body.password,
  });
  signedUpUser
    .save()
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      response.json(error);
    });
});

module.exports = authRouter;
