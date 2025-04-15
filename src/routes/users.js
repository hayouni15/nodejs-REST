import express from "express";
import { User } from "../models/user.js";
import { auth } from "../midleware/auth.js";

const router = new express.Router();

router.get("/users/test", async (req, res) => {
  res.status(200).send("this is a test");
});

router.get("/users", auth, async (req, res) => {
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

router.delete("/users/delete/me", auth, async (req, res) => {
  const user = req.user;
  console.log("this is the user", user);
  const _id = user._id;
  try {
    const user = new User(req.user);
    const deletedUser = await User.deleteOne({ _id: user._id });
    if (!deletedUser) {
      res.status(401).send("User not found with the specified ID");
    }
    res.status(201).send(deletedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const _id = req.user._id;
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

    res.status(200).send({ user: updatedUser.getPublicUser(), token });
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

router.post("/logout", auth, async (req, res) => {
  const user = req.user;
  try {
    user.tokens = user.tokens.filter((token) => {
      token != user.token;
    });
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    console.log("Error loging out");
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("/logoutAll", auth, async (req, res) => {
  const user = req.user;
  try {
    user.tokens = [];
    const loggedOutUSer = await user.save();
    if (!loggedOutUSer) {
      throw new Error("");
    }
    res.status(200).send(loggedOutUSer);
  } catch (error) {
    res.status(500).send("error");
  }
});

export { router };
