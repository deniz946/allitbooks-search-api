const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const searchRouter = require("./routes/search");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/search", searchRouter);

app.use(({ errMsg, status = 400 }, req, res, next) => {
  const err = new Error();
  err.status = status;
  err.message = errMsg;
  res.send(err);
});

module.exports = app;
