const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');

const router = express.Router();

router.post('/create', function (req, res) {
  if (req.body.username.length > 15 || req.body.password.length > 15) {
    res.status(400).send('Không hợp lệ');
    return;
  }
  bcrypt.hash(req.body.password, 10).then(function(hash) {
    const user = {
      username: req.body.username,
      password: hash,
      full_name: req.body.full_name,
      role: req.body.role,
    };
    pool.getConnection(function(err, con) {
      con.query(`SELECT * FROM user WHERE username='${req.body.username}'`, function (error, results) {
      if (error) {
        res.status(400).send('Error');
        con.release();
      }else{
        if (results.length) {
          res.status(400).send('Tên tài khoản đã sử dụng');
          con.release();
          return;
        }
        con.query('INSERT INTO user SET ?', user, function (error, results) {
        if (error) {
          res.status(400).send('Error');
          con.release();
        }else{
          con.query(`SELECT * FROM user WHERE username='${user.username}'`, function (error, results) {
          if (error) {
            res.status(400).send('Error');
          }else{
            res.status(200).json(results[0]);
            con.release();
          }
          });
        }
        });
      }
      });
    });
});
});
router.get('/users', function(req, res) {
  pool.getConnection(function(err, con) {
    con.query(`SELECT * FROM user`, function (error, results) {
    if (error) {
      res.status(400).send('Error');
      con.release();
    }else{
      res.status(200).json(results);
      con.release();
    }
    });
  });
})
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  pool.getConnection(function(err, con) {
    con.query(`DELETE FROM user WHERE id='${id}'`, function (error, results) {
    if (error) {
      res.status(400).send('Error');
      con.release();
    }else{
      res.status(200).send('Ok');
      con.release();
    }
    });
  });
})
module.exports = router
