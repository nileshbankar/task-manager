const jwt = require("jsonwebtoken");
const User = require("../models/user");
const secreteKey = process.env.JSON_WEB_TOKEN_SECRETE_KEY;

const auth = async (req, resp, next) => {
  try {
    // Authorization token coming from request header
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, secreteKey);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) throw new Error();
    req.token = token;
    req.user = user; // send user object in request

    next();
  } catch (error) {
    resp.status(401).send({ Error: "Unauthorize access" });
  }
};

module.exports = auth;
