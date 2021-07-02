const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secreteKey = process.env.JSON_WEB_TOKEN_SECRETE_KEY;
const Task = require("../models/task");

// userSchema - Add middleware to perform pre/post operation on model before/after saving records
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,

      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("You can not set password as password");
        }
      },
    },
    email: {
      type: String,
      unique: true, // it will not allowed duplicate emails and set index in database
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) throw new Error("Age must be a positive number.");
      },
    },
    avatar: { type: Buffer },
    tokens: [
      {
        token: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
    // This will enable created and updated date on User model
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user.id.toString() }, secreteKey);

  user.tokens.push({ token });

  await user.save();

  return token;
};

// Authenticate user using credentials. Use Statics if it running for all the collection

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Unable to login!");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Unable to login!");

  return user;
};

// userSchema.methods.getPublicFields = function () {

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.avatar;
  delete userObject.tokens;
  return userObject;
};

/**  Middleware code started */

// Hash the password before insert/update
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    const hashedPassword = await bcrypt.hash(user.password, 8);

    user.password = hashedPassword;
  }
  next();
});

// Middleare to remove all the task associated to user which is goint to be deleted
userSchema.pre("remove", async function (next) {
  const user = this;

  await Task.deleteMany({ owner: user._id });

  next();
});

/**  Middleware code end */

const User = mongoose.model("User", userSchema);

module.exports = User;
