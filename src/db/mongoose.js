// const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/task-manager");

// const Tasks = mongoose.model("tasks", {
//   description: {
//     type: String,
//     required: true,
//     default: "",
//     trim: true,
//   },
//   completed: { type: Boolean, default: false, required: true },
// });

// const me = new User({
//   name: "stoura",
//   age: "34",
//   email: "stoudra@gmail.com",
//   password: "password",
// });

// me.save()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// const task = new Tasks({ description: "new task" });
// task
//   .save()
//   .then(() => {
//     console.log("saved");
//   })
//   .catch(() => {});
