var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var async = require("async");
var dbconfig = require("../config/database.js");
var connection = mysql.createConnection(dbconfig);
var case_calcul_module = require("./kingwoo-js");

router.get("/test1", function(req, res) {
  res.send();
});

module.exports = router;
