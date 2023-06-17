const express = require("express");
const mongoose = require("mongoose");
const todoRouter = express.Router();
const Todo = require("../models/Todo");
const isAuthenticated = require("../middlewares/jwt.middleware");

//Get todos
todoRouter.get("/getTodo", isAuthenticated, async (req, res) => {
  console.log(req.user);
  const todos = await Todo.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    message: "successfully retrieved",
    todos,
  });
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

//Delete todo
todoRouter.delete("/deleteTodo/:todoId", async (req, res) => {
  try {
    const todoId = req.params.todoId;
    console.log(todoId);
    const checkToExists = await Todo.findById(todoId);
    if (!checkToExists) {
      throw new Error("No such todo exists");
    }
    const deletedTodo = await Todo.findByIdAndDelete(todoId);
    res.status(200).json({
      success: true,
      message: "Successfully deleted todo",
      deletedTodo,
    });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
});

module.exports = todoRouter;
