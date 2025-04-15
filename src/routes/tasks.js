import mongoose from "mongoose";
import express from "express";
import { auth } from "../midleware/auth.js";
import { Task } from "../models/task.js";
import { User } from "../models/user.js";

const tasksRouter = express.Router();

tasksRouter.get("/tasks/test", async (req, res) => {
  res.status(200).send("testing");
});

tasksRouter.post("/tasks/add", auth, async (req, res) => {
  try {
    const user = req.user;

    const newTask = new Task({ ...req.body, owner: req.user.id });

    const addedTask = await newTask.save();
    if (!addedTask) {
      res.status(401).send("Task not added");
    }
    res.status(201).send(addedTask);
  } catch (error) {
    res.status(401).send("Failed to add task");
  }
});

tasksRouter.get("/tasks", auth, async (req, res) => {
  try {
    // const tasks = await Task.find(req.body).populate({
    //   path: "owner",
    //   model: "User",
    //   localField: "owner",
    //   foreignField: "_id",
    //   justOne: true,
    // });

    // console.log(req.user);

    await req.user.populate("tasks");
    const tasks = req.user.tasks;
    console.log(tasks);
    if (!tasks) {
      res.status(401).send("No tasks found");
    }
    res.status(201).send(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

tasksRouter.get("/tasks/:id", auth, async (req, res) => {
  const user = req.user;
  const taskID = req.params.id;
  console.log(user);
  console.log(taskID);

  try {
    const task = await Task.findOne({ _id: taskID, owner: user._id });
    console.log(task);
    if (!task) {
      res.status(400).send("not tasks found");
    }
    res.status(200).send(task);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

tasksRouter.patch("/tasks/:id", auth, async (req, res) => {
  const user = req.user;
  try {
    const _id = req.params.id;
    const task = await Task.findOne({ _id, owner: user._id });
    const updates = Object.keys(req.body);
    updates.forEach((update) => {
      task[update] = req.body[update];
    });

    const updatedTask = await task.save();

    if (!updatedTask) {
      res.status(401).send("no tasks were found with this ID");
    }
    res.status(200).send(updatedTask);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

tasksRouter.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const user = req.user;
  try {
    const deletedTask = await Task.findOneAndDelete({ _id, owner: user._id });
    if (!deletedTask) {
      res.status(400).send("Can't find task with this id");
    }
    res.status(200).send(deletedTask);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to delete");
  }
});
export { tasksRouter };
