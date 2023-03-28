const router = require("express").Router();

router.get("/login", async (req, res, next) => {
  res.render("login");
});

router.get("/register", async (req, res, next) => {
  res.render("register");
});

router.post("/login", async (req, res, next) => {
  res.send("Logged post");
});

router.post("/register", async (req, res, next) => {
  res.send("register post");
});

router.post("/logout", async (req, res, next) => {
  res.send("logout");
});

module.exports = router;
