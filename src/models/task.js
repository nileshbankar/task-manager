const mongoose = require("mongoose");

const validator = require("validator");

const taskSchema = mongoose.Schema(
  {
    description: { type: String, trim: true, required: true },
    completed: { type: Boolean, default: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    //mongoose.Schema.Types.ObjectId to store user id
  },
  {
    timestamps: true,
    // This will enable created and updated date on User model
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
