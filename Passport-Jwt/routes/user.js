const { hashSync, compareSync } = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();
const UserModel = require("../models/schema");

router.post("/login", (req, res) => {
  UserModel.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "no user found",
      });
    }
    if (!compareSync(req.body.password, user.password)) {
      return res.status(401).send({
        success: false,
        message: "incorrect password",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
    };
    const token = jwt.sign(payload, "Random", { expiresIn: "7d" });

    return res.status(200).send({
      success: true,
      message: "Logged In successfully",
      token: "Bearer " + token,
    });
  });
});

router.post("/register", (req, res) => {
  const user = new UserModel({
    email: req.body.email,
    password: hashSync(req.body.password, 10),
  });

  user
    .save()
    .then((user) => {
      res.send({
        success: true,
        message: "user register successfullly",
        user: {
          email: user.email,
          id: user._id,
        },
      });
    })
    .catch((err) => {
      res.send({
        success: false,
        message: "something went wrong",
        error: err,
      });
    });
});

router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.status(200).send({
      success: true,
      user: {
        email: req.user.email,
        id: req.user.id,
      },
    });
  }
);

module.exports = router;
