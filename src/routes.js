const express = require("express");
const mysql = require("mysql");
const con = require("./database");

const router = express.Router();

// GET REQUESTS

router.get("/", (req, res) => {
  res.send("Boilerplate is wokring!");
});

router.get("/users", (req, res) => {
  con.query(`SELECT * FROM users`, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).json(err);
    } else {
      return res.status(200).json(result);
    }
  });
});

module.exports = router;
