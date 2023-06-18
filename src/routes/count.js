const express = require("express");
const countRouter = express.Router();
const Todo = require("../models/Todo");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

//Update the wasted and display value
countRouter.put("/count/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { wasted, display } = req.body;

    const item = await Todo.findById(id);
    item.wasted = wasted;
    item.display = display;

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
          date: {
            $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            $lt: new Date(),
          },
          //date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 7 days
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
