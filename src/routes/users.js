import express from "express";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";

const router = new express.Router();

router.get("/users/test", async (req, res) => {
  res.status(200).send("this is a test");
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find(req.body);
    if (!users) {
      res.status(401).send("No users were found!");
    }
    res.status(200).send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("/users/add", async (req, res) => {
  const newUser = new User(req.body);
  try {
    const addedUser = await newUser.save();
    res.status(200).send(addedUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/users/delete/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(_id);
    if (!deletedUser) {
      res.status(401).send("User not found with the specified ID");
    }
    res.status(201).send(deletedUser);
  } catch (error) {
    res.status(500).send("Failed to delete user");
  }
});

router.patch("/users/:id", async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).send("no use with this id");
    }
    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    const updatedUser = await user.save();
    if (!updatedUser) {
      res.status(401).send("No user found with this ID");
    }
    res.status(201).send(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(501).send(error);
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.getUserByCredentials({ email, password });
    const token = await user.generateToken();
    user.tokens = user.tokens.concat({ token });
    const updatedUser = await user.save();

    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send("error loging in");
  }
});

router.post("/signup", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const token = await newUser.generateToken();
    newUser.tokens = newUser.tokens.concat({ token });
    const savedUser = await newUser.save();
    if (savedUser) {
      res.status(201).send({ savedUser });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

export { router };
