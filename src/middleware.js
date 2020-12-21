const jwt = require("jsonwebtoken");
require("dotenv").config;

module.exports = {
  validateLogin: (req, res, next) => {
    if (
      !req.body.email ||
      req.body.email.length < 6 ||
      !req.body.email.includes("@")
    ) {
      return res
        .status(400)
        .json({ msg: "Inserted email does not follow the format rules!" });
    }
    if (
      !req.body.password ||
      req.body.password.length < 8 ||
      req.body.password.length > 64
    ) {
      return res
        .status(400)
        .json({ msg: "Inserted password does not follow the format rules!" });
    }
    next();
  },
  isLoggedIn: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      req.userData = decodedToken;
      next();
    } catch (err) {
      return res
        .status(401)
        .send({ msg: "You must be logged in to access these pages!" });
    }
  },
};
