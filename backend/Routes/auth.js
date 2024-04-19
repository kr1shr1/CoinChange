const express = require("express");
const passport = require("passport");
const router = express.Router();
const bcrypt = require('bcrypt')
const registerControl = require("../Controllers/register");
require("../config/passport");

const User = require('../models/user');
const isAuthenticated = require("../config/isauth").ensureAuthenticated;
const logoutControl = require("../Controllers/logout");

router.post(
  "/login",async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) res.status(500).json({ message: "User not Found" });
      else {
        const isCorrect = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!isCorrect) {

          res.status(500).json({ message: "Incorrect password" });
        } else {
          console.log(user)
          const { password, ...others } = user._doc;
          res.status(200).json(others);
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

//* Todo: decomment all the comments when the frontend is connected
router.post("/register", registerControl);
router.post("/logout", logoutControl);
router.get("/signout", isAuthenticated, (req, res, next) => {
  res.status(200).json({ message: "Signned out succesfully" });
  // res.redirect('/auth/login')
});

module.exports = router;
