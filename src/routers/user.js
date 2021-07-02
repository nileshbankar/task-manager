const express = require("express");
const mongoose = require("mongoose");
const sharp = require("sharp");

// Import middleware auth
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
// Import Models
const User = require("../models/user");

const router = new express.Router();

// Post request to add user
router.post("/users", async (req, resp) => {
  try {
    const user = new User(req.body);
    const token = await user.generateAuthToken();

    await user.save();
    resp.status(201).send({ user, token });
  } catch (error) {
    console.log(error);
    resp.status(400).send(error);
  }
});

// Get all users

// router.get("/users", auth, async (req, resp) => {
//   try {
//     const users = await User.find({});
//     return resp.send(users);
//   } catch (error) {
//     resp.status(500).send(error);
//   }
// });

// Get my profile

router.get("/users/me", auth, async (req, resp) => {
  resp.send(req.user); // req.user is property coming from auth.js
});

// Get single user based on id

router.get("/users/:id", async (req, resp) => {
  const _id = req.params.id;
  // added to check whether id is valid objectID
  if (!mongoose.Types.ObjectId.isValid(_id))
    resp.status(404).send("Invalid id!");

  try {
    const user = await User.findById(_id);
    if (!user) resp.status(404);

    resp.send(user);
  } catch (error) {
    resp.status(500).send(error);
  }
});

// Update single user based on id

router.patch("/users/me", auth, async (req, resp) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ["age", "name", "email", "password"];

  const isAllowed = updates.every((update) => allowedUpdate.includes(update));

  if (!isAllowed) return resp.status(400).send(`Fields not allowed to update`);

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));

    await req.user.save();

    resp.send(req.user);
  } catch (error) {
    resp.status(400).send(error);
  }
});

// router.patch("/users/:id", async (req, resp) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdate = ["age", "name", "email", "password"];

//   const isAllowed = updates.every((update) => allowedUpdate.includes(update));

//   if (!isAllowed) return resp.status(400).send(`Fields not allowed to update`);

//   try {
//     const _id = req.params.id;

//     // added to check whether id is valid objectID
//     if (!mongoose.Types.ObjectId.isValid(_id))
//       resp.status(404).send("Invalid id!");

//     // We can not use findByIdAndUpdate as it bypass mongoose and middleware does not run for that need to rewrite code again

//     // const user = await User.findByIdAndUpdate(_id, req.body, {
//     //   new: true,
//     //   runValidators: true,
//     // });

//     const user = await User.findById(_id);

//     if (!user) {
//       return resp.status(404).send();
//     }

//     updates.forEach((update) => (user[update] = req.body[update]));

//     await user.save();

//     resp.send(user);
//   } catch (error) {
//     resp.status(400).send(error);
//   }
// });

// Delete User by Id
router.delete("/users/me", auth, async (req, resp) => {
  try {
    //const user = await User.findByIdAndDelete({ _id: req.user._id });
    //  req.user  is coming from auth middleware
    // if (!user) return resp.status(404).send();

    await req.user.remove();
    resp.send(req.user);
  } catch (error) {
    resp.status(500).send(error);
  }
});

// Login User

router.post("/users/login", async (req, resp) => {
  try {
    // User.findByCredentials = Used "User" because we are running query on all the collection
    // user.generateAuthToken = function will run specific to that user
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    // Generate token
    const token = await user.generateAuthToken();
    resp.send({ user, token }); // getPublicFields is an userdefined function in model
  } catch (error) {
    resp.status(400).send(error);
  }
});

/// log out single session
router.post("/users/logout", auth, async (req, resp) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    // console.log(req.user.tokens, req.token);

    await req.user.save();
    resp.send();
  } catch (error) {
    resp.send(500).send();
  }
});
// log out all active session
router.post("/users/logoutAll", auth, async (req, resp) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    resp.send();
  } catch (error) {
    resp.send(500).send();
  }
});

// Post user profile picture
router.post(
  "/user/me/avatar",
  auth, // middleware
  upload.single("avatar"), // middleware
  async (req, resp) => {
    // req.user.avatar = req.file.buffer;

    // sharp library used to resize and save in png file
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;

    await req.user.save();
    resp.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// Delete user profile picture
router.delete(
  "/user/me/avatar",
  auth,
  async (req, resp) => {
    req.user.avatar = null;
    await req.user.save();
    resp.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// Get user avatar by id
router.get("/users/:id/avatar", async (req, resp) => {
  try {
    const _id = req.params.id;

    // added to check whether id is valid objectID
    if (!mongoose.Types.ObjectId.isValid(_id))
      resp.status(404).send("Invalid id!");
    const user = await User.findById(_id);

    if (!user || !user.avatar) {
      throw new Error();
    }
    resp.set("Content-Type", "image/png");
    resp.send(user.avatar);
  } catch (error) {
    resp.send(500).send();
  }
});

module.exports = router;
