const express = require("express");
const mysql = require("mysql");
const con = require("./database");

const router = express.Router();

//// BASIC GET REQUESTS
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

//// STUDENTS PAGE
// GET
router.get("/students", (req, res) => {
  con.query(`SELECT * FROM students`, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).json(err);
    } else {
      return res.status(200).json(result);
    }
  });
});

// POST
router.post("/add-student", (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  if (name && surname) {
    con.query(
      `SELECT * FROM students WHERE name = '${name}' AND surname = '${surname}'`,
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).json(err);
        } else if (result.length !== 0) {
          return res.status(400).json(err);
        } else {
          con.query(
            `INSERT INTO students (name, surname) VALUES ('${name}', '${surname}' )`,
            (err, result) => {
              if (err) {
                console.log(err);
                return res.status(400).json(err);
              } else {
                return res.status(200).json(result);
              }
            }
          );
        }
      }
    );
  } else {
    return res.status(400).json(err);
  }
});

// DELETE
router.delete("/students", (req, res) => {
  const id = req.body.id;
  if (id) {
    con.query(`SELECT * FROM students WHERE id = '${id}'`, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).json(err);
      } else if (result.length !== 1) {
        return res.status(400).json(err);
      } else {
        con.query(`DELETE FROM students WHERE id = '${id}'`, (err, result) => {
          if (err) {
            console.log(err);
            return res.status(400).json(err);
          } else {
            return res.status(200).json(result);
          }
        });
      }
    });
  } else {
    return res.status(400).json(err);
  }
});

module.exports = router;
