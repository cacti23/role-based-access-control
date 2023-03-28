const router = require("express").Router();
const User = require("../models/user");

router.get("/login", async (req, res, next) => {
  res.render("login");
});

router.post("/login", async (req, res, next) => {
  res.send("Logged post");
});

router.get("/register", async (req, res, next) => {
  res.render("register");
});

router.post("/register", async (req, res, next) => {
  try {
    const { email } = req.body;

    const doesExists = await User.findOne({ email });

    if (doesExists) {
      res.redirect("/auth/register");

      return;
    }

    const newUser = new User(req.body);

    await newUser.save();

    res.send(newUser);
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  res.send("logout");
});

module.exports = router;
