const express = require("express");
const mongoose = require("mongoose");
const router = new express.Router();

const Task = require("../models/task");
const auth = require("../middleware/auth");

/**
 *          FOR TASK
 *
 */

// Post request to add Task

router.post("/tasks", auth, async (req, resp) => {
  const task = new Task({ ...req.body, owner: req.user._id });

  try {
    await task.save();
    resp.status(201).send(task);
  } catch (error) {
    resp.status(400).send(error);
  }
});

// Get all task
/**
 *  Get Options
 *  1) /tasks - returs all the task
 *  2) /tasks?completed=true - returns only completed task
 *  3) /tasks?limit=2&skip=2
 *  4) /tasks?sortBy=createdAt:asc
 */

router.get("/tasks", auth, async (req, resp) => {
  try {
    // const tasks = await Task.find({ owner: req.user._id });

    const match = {}; // Filter

    const sort = {}; // Sort

    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");

      sort[parts[0]] = parts[1] === "asc" ? 1 : -1;
    }
    await req.user
      .populate({
        path: "tasks", // coming from user model
        match,
        options: {
          limit: parseInt(req.query.limitparts[1]),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();

    resp.send(req.user.tasks);
  } catch (error) {
    resp.status(500).send(error);
  }
});

// Get task by Id

router.get("/tasks/:id", auth, async (req, resp) => {
  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return resp.status(404).send("Invalid id!");

  try {
    // const task = await Task.findById(_id);
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) return resp.status(404).send();

    resp.send(task);
  } catch (error) {
    resp.status(500).send(error);
  }
});
// Delete task by Id
router.delete("/tasks/:id", auth, async (req, resp) => {
  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return resp.status(404).send("Invalid id!");

  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) return resp.status(404).send();
    resp.send(task);
  } catch (error) {
    resp.status(500).send(error);
  }
});

// Update task by Id

router.patch("/tasks/:id", auth, async (req, resp) => {
  try {
    const _id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(_id))
      return resp.status(404).send("Invalid id!");

    const updates = Object.keys(req.body);
    const allowedUpdate = ["description", "completed"];
    const isAllowed = updates.every((update) => allowedUpdate.includes(update));

    if (!isAllowed) return resp.status(400).send("Field not allowed to update");

    // We can not use findByIdAndUpdate as it bypass mongoose and middleware does not run for that need to rewrite code again

    // const task = await Task.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) return resp.status(404).send("Task not found");

    updates.forEach((update) => (task[update] = req.body[update]));
    task.save();

    resp.send(task);
  } catch (error) {
    resp.status(500).send(error);
  }
});

module.exports = router;
