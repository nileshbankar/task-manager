const mongoose = require("mongoose");

const express = require("express");

require("./db/mongoose");

// Import Models
//const User = require("./models/user");
const Task = require("./models/task");

// Routers

const userRouter = require("./routers/user.js");
const taskRouter = require("./routers/task.js");

const app = express();

const port = process.env.PORT; // port coming from .env file

// This code will parce incoming json into an object
app.use(express.json());

/**
 *  30-6-21
 *  Without express middleware  == new request comes in => run route handler
 *
 *  With epress middleware    ==   New request => Do something => run route handler
 *
 *  Express middleware need to add before app.use function
 */

///////////////  Middleware code Start  ////////////////////////

// In case of maintainance plan

// app.use((req, resp, next) => {
//   resp
//     .status(503)
//     .send(
//       "Site is unavailable due to maintainance, please try after some time!"
//     );
// });

///////////////  Middleware code End  ////////////////////////

// Register router
app.use(userRouter);
app.use(taskRouter);

//require("./emails/account");

app.listen(port, () => {
  console.log("server is running on port :" + port);
});
