import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Task } from "./task.js";

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 0 },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password cannot contain 'password'");
      }
    },
  },
  tokens: [
    {
      token: { type: String, require: true },
    },
  ],
});

schema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

schema.methods.getPublicUser = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

schema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign({ user: user._id.toString() }, "thisisasecretstring");
  return token;
};

schema.statics.getUserByCredentials = async (credentials) => {
  const user = await User.findOne({ email: credentials.email });
  if (!user) {
    throw new Error("Failed to login");
  }
  const isMatch = await bcrypt.compare(credentials.password, user.password);
  if (!isMatch) {
    throw new Error("Failed to login");
  }
  return user;
};

// hash password before saving
schema.pre("save", async function () {
  console.log("pre save hook");
  let user = this;
  if (user.isModified("password")) {
    const newPassword = await bcrypt.hash(user.password, 8);
    user.password = newPassword;
  }
});

// remove tasks before removing user
schema.pre("deleteOne", async function () {
  const user = this;
  try {
    console.log("before findOneAndDelete");
    await Task.deleteMany({ owner: user._id });
  } catch (error) {
    console.log(error);
    res.send.send(500);
  }
});
const User = mongoose.model("User", schema);

export { User };
