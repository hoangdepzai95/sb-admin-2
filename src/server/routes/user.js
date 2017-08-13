const express = require('express');
import bcrypt from 'bcrypt';
import pool from '../db';

const router = express.Router();

router.post('/create', function (req, res) {
  if (req.body.name.length > 15 || req.body.password.length > 15) {
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
      con.query(`SELECT * FROM user WHERE username='${req.body.username}'`, function (error, results, fields) {
      if (error) {
        console.log(error);
        res.status(400).send('Error');
      }else{
        if (results.length) {
          res.status(400).send('Tên tài khoản đã sử dụng');
          return;
        }
        con.query('INSERT INTO user SET ?', user, function (error, results, fields) {
        if (error) {
          console.log(error);
          res.status(400).send('Error');
        }else{
          res.status(200).end('success');
        }
        });
      }
      });
    });
});
});
module.exports = router
