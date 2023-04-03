const router = require("express").Router();
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");

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
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Email must be a valid email")
      .normalizeEmail()
      .toLowerCase(),
    body("password")
      .trim()
      .isLength(2)
      .withMessage("Password length short, min 2 char required"),
    body("password2").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password do not match");
      }
      return true;
    }),
  ],
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
