import mongoose from "mongoose";
import validator from "validator";

const Task = mongoose.model("tasks", {
  description: {
    type: String,
    required: true,
    default: "",
    trim: true,
  },
  completed: { type: Boolean, default: false, required: true },
});

export { Task };
