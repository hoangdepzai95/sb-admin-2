import pool from '../db';

const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
  const customer = {
    phone: req.body.phone,
    name: req.body.name,
    facebook: req.body.facebook,
    address: req.body.address,
  };
  pool.getConnection((err, con) => {
    con.query('INSERT INTO customer SET ?', customer, (error, result) => {
      if (error) {
        res.status(400).send('Error');
      } else {
        res.status(200).send('Ok');
      }
    });
  });
});

module.exports = router;
