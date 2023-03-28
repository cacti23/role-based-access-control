const express = require("express");
const createHttpError = require("http-errors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", require("./routes"));
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));

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
