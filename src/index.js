const express = require("express");
const mongoose = require("mongoose");
const { router } = require("./routes/users");
const { tasksRouter } = require("./routes/tasks");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(router);
app.use(tasksRouter);

mongoose.connect("mongodb://localhost:27017/task-manager");

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

const port = process.env.PORT || 3000; // Default to 3000 if PORT is not set
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

const myfunction = async () => {
  const token = jwt.sign({ _id: "123" }, "secret");
  console.log(token);

  const data = jwt.verify(token, "secret");
  console.log(data);
};

myfunction();
