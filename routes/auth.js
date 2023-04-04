const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");
const User = require("../models/user");
const { registerValidator } = require("../utils/validators");

router.get(
  "/login",
  ensureLoggedOut({ redirectTo: "/" }),
  async (req, res, next) => {
    res.render("login");
  }
);

router.post(
  "/login",
  ensureLoggedOut({ redirectTo: "/" }),
  passport.authenticate("local", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
  }),
  async (req, res, next) => {
    res.send("Logged post");
  }
);

router.get(
  "/register",
  ensureLoggedOut({ redirectTo: "/" }),
  async (req, res, next) => {
    res.render("register");
  }
);

router.post(
  "/register",
  ensureLoggedOut({ redirectTo: "/" }),
  registerValidator,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
          req.flash("error", error.msg);
        });

        res.render("register", {
          email: req.body.email,
          messages: req.flash(),
        });
        return;
      }

      const { email } = req.body;

      const doesExists = await User.findOne({ email });

      if (doesExists) {
        res.redirect("/auth/register");

        return;
      }

      const newUser = new User(req.body);

      await newUser.save();

      req.flash(
        "success",
        `${newUser.email} registered successfully, you can now login`
      );
      res.redirect("/auth/login");
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/logout",
  ensureLoggedIn({ redirectTo: "/" }),
  async (req, res, next) => {
    req.logout(() => {
      console.info("User logged out");
    });

    res.redirect("/");
  }
);

module.exports = router;
