const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

//// LOGIN (REGISTER)
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  con.query(`SELECT * FROM users WHERE email = '${email}'`, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).json(err);
    } else if (result.length !== 1) {
      return res.status(400).json(err);
    } else if (result[0].password === null) {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.log(err);
          return res.status(400).json(err);
        } else {
          con.query(
            `UPDATE users SET password = '${hash}' WHERE email = '${email}'`,
            (err, result) => {
              if (err) {
                console.log(err);
                return res.status(400).json(err);
              } else {
                con.query(
                  `SELECT id, email FROM users WHERE password = '${hash}'`,
                  (err, result) => {
                    if (err) {
                      console.log(err);
                      return res.status(400).json(err);
                    } else {
                      const token = jwt.sign(
                        {
                          userId: result[0].id,
                          userEmail: result[0].email,
                        },
                        process.env.SECRET_KEY,
                        {
                          expiresIn: "1d",
                        }
                      );
                      return res.status(200).json({
                        msg: "Successfully Registered",
                        token,
                        userData: {
                          userId: result[0].id,
                          userEmail: result[0].email,
                        },
                      });
                    }
                  }
                );
              }
            }
          );
        }
      });
    } else {
      bcrypt.compare(password, result[0].password, (bErr, bResult) => {
        if (bErr || !bResult) {
          return res.status(400).json(err);
        } else if (bResult) {
          const token = jwt.sign(
            {
              userId: result[0].id,
              userEmail: result[0].email,
            },
            process.env.SECRET_KEY,
            {
              expiresIn: "1d",
            }
          );
          return res.status(200).json({
            msg: "Successfully Logged In",
            token,
            userData: {
              userId: result[0].id,
              userEmail: result[0].email,
            },
          });
        }
      });
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

//// LECTURERS PAGE
// SHOW ALL LECTURERS
router.get("/lecturers", (req, res) => {
  con.query(`SELECT id, name, surname FROM users`, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).json(err);
    } else {
      return res.status(200).json(result);
    }
  });
});

// SHOW SPECIFIC LECTURER
router.get("/lecturers/:lecturer_id", (req, res) => {
  const lecturer_id = req.params.lecturer_id;
  if (lecturer_id) {
    con.query(
      `SELECT * FROM users WHERE id = '${lecturer_id}'`,
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).json(err);
        } else if (result.length !== 1) {
          return res.status(400).json(err);
        } else {
          return res.status(200).json(result);
        }
      }
    );
  } else {
    return res.status(400).json(err);
  }
});

// ADD LECTURER
router.post("/add-lecturer", (req, res) => {
  const lecturer_name = req.body.lecturer_name;
  const lecturer_surname = req.body.lecturer_surname;
  const lecturer_email = req.body.lecturer_email;
  if (lecturer_name && lecturer_surname && lecturer_email) {
    con.query(
      `SELECT * FROM users WHERE name = '${lecturer_name}' AND surname = '${lecturer_surname}' OR email = '${lecturer_email}'`,
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).json(err);
        } else if (result.length !== 0) {
          return res.status(400).json(err);
        } else {
          con.query(
            `INSERT INTO users (name, surname, email) VALUES ('${lecturer_name}', '${lecturer_surname}', '${lecturer_email}')`,
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

// DELETE LECTURER
router.delete("/lecturers", (req, res) => {
  const lecturer_id = req.body.lecturer_id;
  if (lecturer_id) {
    con.query(
      `SELECT * FROM users WHERE id = '${lecturer_id}'`,
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).json(err);
        } else if (result.length !== 1) {
          return res.status(400).json(err);
        } else {
          con.query(
            `DELETE FROM users WHERE id = '${lecturer_id}'`,
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

module.exports = router;
