const mongoose = require("mongoose");

const validator = require("validator");

const connectionURL = process.env.MONGODB_URL;

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

/// User Model

// const User = mongoose.model("User", {
//   name: { type: String, required: true, trim: true },
//   password: {
//     type: String,
//     required: true,
//     trim: true,
//     minLength: 6,

//     validate(value) {
//       if (value.toLowerCase().includes("password")) {
//         throw new Error("You can not set password as password");
//       }
//     },
//   },
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     lowercase: true,
//     validate(value) {
//       if (!validator.isEmail(value)) {
//         throw new Error("Email is not valid");
//       }
//     },
//   },
//   age: {
//     type: Number,
//     default: 0,
//     validate(value) {
//       if (value < 0) throw new Error("Age must be a positive number.");
//     },
//   },
// });

// const me = new User({
//   name: "Spruha ",
//   email: "nileshSBankar@gmail.com",
//   password: "123@pass",
// });

// me.save()
//   .then(() => {
//     console.log(me);
//   })
//   .catch((error) => {
//     console.error("Error!", error);
//   });

/// TASK Model

// const Task = mongoose.model("Task", {
//   description: { type: String, trim: true, required: true },
//   completed: { type: Boolean, default: false },
// });

// const t = new Task({
//   description: "Take lunch by 2 PM    ",
// });

// t.save()
//   .then(() => {
//     console.log(t);
//   })
//   .catch((error) => console.error("Error!", error._message));
