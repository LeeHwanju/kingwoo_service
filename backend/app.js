var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mysql = require("mysql");
var dbconfig = require("./config/database.js");
var connection = mysql.createConnection(dbconfig);

// get movie router
const indexRouter = require("./routes/index");
const movieRouter = require("./routes/movie");
const testRouter = require("./routes/test");
const validRouter = require("./routes/valid_0");
const valid_newRouter = require("./routes/valid_new");
var app = express();
app.use(require("connect-history-api-fallback")());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// use middleware
app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// route
app.use("/", indexRouter);
app.use("/api/movies", movieRouter);
app.use("/api/test", testRouter);
app.use("/api/valid", validRouter);
app.use("/api/valid_new", valid_newRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
