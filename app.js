const express = require("express");
const createHttpError = require("http-errors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const session = require("express-session");
const connectFlash = require("connect-flash");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const { ensureLoggedIn } = require("connect-ensure-login");
const { roles } = require("./utils/constants");

const app = express();

app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// init session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // secure: true,
      httpOnly: true,
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
require("./utils/passport");

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use("/", require("./routes"));
app.use("/auth", require("./routes/auth"));
app.use(
  "/user",
  ensureLoggedIn({ redirectTo: "/auth/login" }),
  require("./routes/user")
);

app.use(
  "/admin",
  ensureLoggedIn({ redirectTo: "/auth/login" }),
  ensureAdmin,
  require("./routes/admin")
);

app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

app.use((error, req, res, next) => {
  error.status = error.status || 500;

  res.status(error.status);

  res.render("error_40x", { error });
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("💾 connected");

    app.listen(PORT, () => console.log(`🚀 on port ${PORT}`));
  })
  .catch((err) => {
    console.log(err.message);
  });

function ensureAdmin(req, res, next) {
  if (req.user.role === roles.admin) {
    next();
  } else {
    req.flash("warning", "You are not authorized for this route");
    res.redirect("/");
  }
}
