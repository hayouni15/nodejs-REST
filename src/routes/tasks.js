import mongoose from "mongoose";
import express from "express";

import { Task } from "../models/task.js";

const tasksRouter = express.Router();

tasksRouter.get("/tasks/test", async (req, res) => {
  res.status(200).send("testing");
});

tasksRouter.post("/tasks/add", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const addedTask = await newTask.save();
    if (!addedTask) {
      res.status(401).send("Task not added");
    }
    res.status(201).send(addedTask);
  } catch (error) {
    res.status(401).send("Failed to add task");
  }
});

tasksRouter.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find(req.body);
    if (!tasks) {
      res.status(401).send("No tasks found");
    }
    res.status(201).send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

tasksRouter.patch("/tasks/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findById(_id);
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

tasksRouter.delete("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const deletedTask = await Task.findByIdAndDelete(_id);
    if (!deletedTask) {
      res.status(400).send("Can't find task with this id");
    }
    res.status(200).send(deletedTask);
  } catch (error) {
    res.status(500).send("Failed to delete");
  }
});
export { tasksRouter };
