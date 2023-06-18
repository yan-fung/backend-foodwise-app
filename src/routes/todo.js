const express = require("express");
const mongoose = require("mongoose");
const todoRouter = express.Router();
const Todo = require("../models/Todo");
const isAuthenticated = require("../middlewares/jwt.middleware");

//Get todos
todoRouter.get("/getTodo", isAuthenticated, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id, display: true });
    res.status(200).json({ message: "Successfully retrieved", todos });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }

  // console.log(req.user);
  // const todos = await Todo.find({ user: req.user.id });
  // res.status(200).json({
  //   success: true,
  //   message: "successfully retrieved",
  //   todos,
  // });
});

//Create todo
todoRouter.put("/createTodo", (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    wasted: false,
    user: req.body.userID,
  });
  todo.save().then((todo) => {
    res.json(todo);
  });
});

//Update the display value as false
todoRouter.put("/deleteTodo/:todoId", async (req, res) => {
  try {
    const { todoId } = req.params;
    const { display } = req.body;

    const result = await Todo.findById(todoId);
    result.display = display;

    await result.save();

    res.status(201).json({ result });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
});

module.exports = todoRouter;
