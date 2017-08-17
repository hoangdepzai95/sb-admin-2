import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import xjwt from 'express-jwt';
import pool from '../db';
import user from './user';
import product from './product';
import bill from './bill';
import customer from './customer';

function genJti() {
  let jti = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++) {
      jti += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return jti;
}

function createAccessToken(username, role) {
  return jwt.sign({
    iss: 'hoang',
    aud: 'nguyen',
    exp: Math.floor(Date.now() / 1000) + (60 * 600000000),
    username,
    role,
    sub: "lalaland|gonto",
    jti: genJti(), // unique identifier for the token
    alg: 'HS256'
  }, 'hoangdepzai');
}

function getUserScheme(req) {
  return {
    username: req.body.username,
    password: req.body.password,
  };
}

const jwtCheck = xjwt({
  secret: 'hoangdepzai',
  audience: 'nguyen',
  issuer: 'hoang',
});

// Check for scope
function requireScope(role, ingore) {
  return function (req, res, next) {
    var has_scopes = req.user.role <= role;
    if (req.method === ingore) has_scopes = true;
    if (!has_scopes) {
        res.sendStatus(401);
        return;
    }
    next();
  };
}


const express = require('express');

const router = express.Router();
router.post('/login', function(req, res) {

  var userScheme = getUserScheme(req);
  pool.getConnection(function(err, con) {
    con.query(`SELECT * FROM user WHERE username='${userScheme.username}'`, function (error, results, fields) {
    if (error) {
      res.status(400).send('Error');
    }else{
      if (!results.length) {
        res.status(400).send('Tài khoản không tồn tại');
        return;
      }
      bcrypt.compare(userScheme.password, results[0].password, function(err, _res) {
          if (_res === true) {
            res.status(201).send({
              access_token: createAccessToken(results[0].username, results[0].role),
              user: results[0],
            });
          } else {
            res.status(400).send('Sai thông tin');
            return;
          }
      });
    }
    });
  });
});
router.use('/auth', jwtCheck);
router.use('/auth/user', requireScope(1), user);
router.use('/auth/product', requireScope(2, 'GET'), product);
router.use('/auth/bill', requireScope(3), bill);
router.use('/auth/customer', requireScope(3), customer);

module.exports = router;
