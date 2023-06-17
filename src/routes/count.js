const express = require("express");
const countRouter = express.Router();
const Todo = require("../models/Todo");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

//Update the wasted value from false to true
countRouter.put("/count/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { wasted } = req.body;

    const item = await Todo.findById(id);
    item.wasted = wasted;

    await item.save();

    res.status(201).json(item);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Count the true value
countRouter.get("/count/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    if (!userID) {
      res.status(404).send("User not found");
    }

    const pipeline = [
      {
        $match: {
          user: new ObjectId(userID),
          wasted: true,
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
    ];
    const result = await Todo.aggregate(pipeline);

    if (result.length === 0) {
      return;
    }
    res.json({ total: result[0].count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = countRouter;
