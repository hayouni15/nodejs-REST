import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
  description: {
    type: String,
    required: true,
    default: "",
    trim: true,
  },
  completed: { type: Boolean, default: false, required: true },
  owner: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
});
const Task = mongoose.model("Task", taskSchema);

export { Task };
